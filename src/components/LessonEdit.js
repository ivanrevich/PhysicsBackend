import { Container, Divider, FormControl, FormLabel, Sheet, Typography } from "@mui/joy"
import { Box, Button, Input, Stack, Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AddCircle, Bolt, Delete, Save, SkipNext, SkipPrevious } from "@mui/icons-material";
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import Editor from "../components/Editor";
import useWindowDimensions from "../hooks/useWindowDimentions";
import FormComponent from "./FormComponent";
import { NumericFormat } from 'react-number-format';


const NumericFormatAdapter = React.forwardRef(
    function NumericFormatAdapter(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
            />
        );
    },
);

const LessonEdit = ({ lesson, title, setLesson, setTitle }) => {
    const [index, setIndex] = useState(-1);
    const [points, setPoints] = useState(lesson?.pages[index]?.points ? lesson.pages[index].points : 0);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [yesorno, setYesOrNo] = useState();
    const [value, setValue] = useState();
    const [answers, setAnswers] = useState([]);
    const [trueAnswers, setTrueAnswers] = useState([]);
    const [typeForm, setTypeForm] = React.useState();
    const { width, height } = useWindowDimensions();


    const formTypeHandler = async (value) => {
        if (lesson?.pages[value]?.form?.formType == "YES_OR_NO") {
            setTypeForm('Да / Нет');
            setYesOrNo(lesson?.pages[value]?.form?.rightAnswers.includes("Да"));
        }
        if (lesson?.pages[value]?.form?.formType == "CHOOSE_CORRECTS") {
            setTypeForm('Выбор вариантов ответа');
            setAnswers(lesson?.pages[value]?.form?.answers);
            setTrueAnswers(lesson?.pages[value]?.form?.rightAnswers);
        }
        if (lesson?.pages[value]?.form?.formType == "CHOOSE_ONE") {
            setTypeForm('Выбор вариантов ответа');
            setAnswers(lesson?.pages[value]?.form?.answers);
            setTrueAnswers(lesson?.pages[value]?.form?.rightAnswers);
        }
        if (lesson?.pages[value]?.form?.formType == "CALC") {
            setTypeForm('Посчитать');
            setValue(lesson?.pages[value]?.form?.rightAnswers?.[0] ? lesson?.pages[value]?.form?.rightAnswers?.[0] : 0);
        }
    }

    const addyPage = async (type) => {
        const response = await axiosPrivate.post(`/api/v1/page/add`,
            JSON.stringify({
                lesson_id: lesson.id,
                type: type,
                stepid: lesson.pages.length
            })
        );
        lesson.pages = [...lesson?.pages, response?.data];
        setLesson(lesson);
        setIndex(lesson.pages.length - 1);
    }

    const delPage = async (id) => {
            await axiosPrivate.delete(`/api/v1/page/delete`,
                {
                    params: {
                        id: id,
                    },
                }
            );
            lesson.pages = lesson?.pages.filter(el =>
                el.id !== id
            );
            setLesson(lesson);
            if (index - 1 >= 0) {
                setIndex(index - 1);
            } else if (index == 0 && lesson.pages.length > 0) {
                setIndex(0);
            } else {
                setIndex(-1);
            }
    }

    const updateTitleLesson = async (lesson_id, title) => {
        await axiosPrivate.put(`/api/v1/lessons/update-title`,
            JSON.stringify({
                id: lesson_id,
                title: title
            })
        );
        setTitle(title);
    }

    const updateForm = async (lesson, index, formType) => {
        if (lesson?.pages[index]?.form ? lesson?.pages[index]?.form : null != null) {
            var typeFormReq = "CALC";
            if ('Да / Нет' == formType) {
                typeFormReq = "YES_OR_NO";
                lesson.pages[index].form.answers = ["Да", "Нет"];
                lesson.pages[index].form.rightAnswers = (yesorno === true ? ["Да"] : ["Нет"]);
            } else if ('Выбор вариантов ответа' == formType) {
                if (lesson.pages[index].form.rightAnswers.length != 1) {
                    typeFormReq = "CHOOSE_CORRECTS";
                } else {
                    typeFormReq = "CHOOSE_ONE";
                }
                lesson.pages[index].form.answers = answers;
                lesson.pages[index].form.rightAnswers = trueAnswers;
            } else if ('Посчитать' == formType) {
                typeFormReq = "CALC";
                lesson.pages[index].form.answers = [];
                lesson.pages[index].form.rightAnswers = [value];
            }
            lesson.pages[index].form.formType = typeFormReq;
            setLesson(lesson);
            await axiosPrivate.put(`/api/v1/forms/edit`,
                JSON.stringify({
                    form_id: lesson.pages[index].form.id,
                    page_id: lesson.pages[index].id,
                    htmlText: lesson.pages[index].texts,
                    type: typeFormReq,
                    answers: lesson.pages[index].form.answers,
                    rightAnswers: lesson.pages[index].form.rightAnswers
                })
            );
        }
    }

    const updatePage = async (id, text, points) => {
        await axiosPrivate.put(`/api/v1/page/edit`,
            JSON.stringify({
                id: id,
                text: text,
                points: points
            })
        );

    }

    const handleSave = async (lesson, title, pageid, formType) => {
        updateTitleLesson(lesson.id, title);
        if(lesson.pages.length>0){
            updatePage(lesson.pages[pageid].id, lesson.pages[pageid].texts, lesson.pages[pageid].points);
        }
        updateForm(lesson, index, formType);
    }


    return (
        <Sheet sx={{ display: "flex", 
            borderRadius: 5, 
            flexDirection: "column", 
            flexShrink: 1, 
            flexGrow: 1, 
            maxWidth: (70 * (width / 100)),
            overflowY:"scroll",
            scrollbarWidth:"none"
            }} variant="outlined">
            {lesson?.id != null ?
                <Stack direction={"column"} gap={0.5} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    pl: 2,
                    pt: 1,
                    pr: 2,
                    pb: 2,
                }}>
                    <Stack direction={"row"} sx={{ gap: 1, my: 1 }}>
                        <Input
                            variant="plain"
                            sx={{
                                '--joy-focus-thickness': 0,
                                flexGrow: 1, fontWeight: 600, fontSize: 22, px: 1,
                            }}
                            value={title} onChange={(e) => setTitle(e.target.value)}></Input>
                        <Input
                            variant="outlined"
                            slotProps={{
                                input: {
                                    component: NumericFormatAdapter,
                                },
                            }}
                            startDecorator={<Bolt />}
                            value={points}
                            onChange={(e) => {
                                setPoints(e.target.value);
                                if (index >= 0) {
                                    lesson.pages[index].points = e.target.value
                                }
                            }}
                            sx={{
                                '--joy-focus-thickness': 0,
                                fontWeight: 600, fontSize: 22, px: 1,
                                maxWidth: 100,
                            }}
                        ></Input>
                        <Button sx={{ flexGrow: 0 }} onClick={() => handleSave(lesson, title, index, typeForm)} startDecorator={<Save></Save>}>cохранить</Button>
                        <IconButton color={"danger"} sx={{ flexGrow: 0 }} variant="soft" onClick={() => {
                            if (index >= 0 && lesson.pages.length!=0) { 
                                delPage(lesson.pages[index].id);
                            }
                        }}><Delete /></IconButton>
                    </Stack>
                    <Tabs aria-label="tabs"
                        value={index}
                        defaultValue={-1}
                        onChange={(event, value) => {
                            setIndex(value);
                            setPoints(lesson?.pages[value]?.points ? lesson.pages[value].points : 0);
                            formTypeHandler(value);
                        }}
                        sx={{
                            mb: 0,
                            display: "flex",
                            flexGrow: 1,
                        }}>
                        <Box sx={{
                            px: 0.5,
                            bgcolor: 'background.level1',
                            borderRadius: 'xl',
                            flexGrow: 0,
                            boxSizing: "border-box",
                        }}>
                            <TabList
                                disableUnderline
                                defaultValue={0}
                                sx={{
                                    p: 0.5,
                                    gap: 0.5,
                                    bgcolor: 'background.level1',
                                    boxSizing: "border-box",
                                    flexBasis: "100%",
                                    overflowX: 'scroll',
                                    overflowY: "clip",
                                    scrollSnapType: 'x mandatory',
                                    borderRadius: 'xl',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                        boxShadow: 'sm',
                                        bgcolor: 'background.surface',
                                    },
                                }}
                            >
                                {lesson?.pages?.map((el, index) => (
                                    <Tab key={index} value={index} disableIndicator sx={{ flex: 'none', scrollSnapAlign: 'start' }}>
                                        {index + 1 + '.'} {el.infoType !== "TASK" ? "Теория" : "Задача"}
                                    </Tab>
                                ))}

                                <Dropdown>
                                    <MenuButton
                                        slots={{ root: IconButton }}
                                        slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
                                    >
                                        <AddCircle />
                                    </MenuButton>
                                    <Menu placement="bottom-end">
                                        <MenuItem onClick={() => addyPage("THEORY")}>
                                            Теория
                                        </MenuItem>
                                        <MenuItem onClick={() => addyPage("TASK")}>
                                            Задача
                                        </MenuItem>
                                    </Menu>
                                </Dropdown>
                            </TabList>
                        </Box>
                        {lesson?.pages?.length
                            ? (<div style={{ display: "flex", height: "100%" }}>
                                {lesson?.pages?.map((el, idx) => (
                                    <span style={idx === index ? { flexGrow: 1, display: "flex", padding: 0 } : { flexGrow: 0, display: "flex", padding: 0 }}>
                                        {idx === index ?
                                            <TabPanel value={idx} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "start", paddingTop: 2, px: 0, paddingBottom: 2, px: 0 }}>
                                                {el.infoType !== "TASK" ?
                                                    <div style={{
                                                        display: "flex",
                                                        flexGrow: 1,
                                                        flexShrink: 0,
                                                        flexDirection: "column",
                                                        scrollbarWidth: "none",
                                                        maxHeight: height * 0.67,
                                                        maxWidth: width * 0.67,
                                                        overflowY: "scroll",
                                                    }}>
                                                        <Editor lesson={lesson} setLesson={setLesson} index={index} />
                                                    </div> :
                                                    <Stack flexDirection={"row"} sx={{ display: "flex", flexGrow: 1, gap: 2 }}>
                                                        <div style={{
                                                            display: "flex",
                                                            width: "50%",
                                                            flexGrow: 0,
                                                            flexShrink: 0,
                                                            marginBottom: 5,
                                                            flexDirection: "column",
                                                            gap: 10,

                                                            scrollbarWidth: "none",
                                                            maxHeight: height * 0.67,
                                                            maxWidth: width * 0.4,
                                                            overflowY: "scroll",
                                                        }}>
                                                            <Typography level="body-xs"
                                                                textTransform="uppercase"
                                                                alignSelf={"flex-start"}
                                                                paddingLeft={0.5}
                                                                paddingTop={0.5}
                                                                sx={{ letterSpacing: '0.15rem' }}>Текст задачи</Typography>

                                                            <Editor lesson={lesson} setLesson={setLesson} index={index} />
                                                        </div>
                                                        <FormComponent
                                                            typeForm={typeForm} setTypeForm={setTypeForm}
                                                            yesorno={yesorno} setYesOrNo={setYesOrNo}
                                                            value={value} setValue={setValue}
                                                            answers={answers} setAnswers={setAnswers}
                                                            trueAnswers={trueAnswers} setTrueAnswers={setTrueAnswers}
                                                            width={width} height={height} />
                                                    </Stack>
                                                }
                                            </TabPanel>
                                            : <span></span>
                                        }
                                    </span>
                                ))}
                            </div>
                            ) : <Stack direction={"row"} sx={{ gap: 1, flexGrow: 1, display: "flex" }}><p>Добавьте новую страницу сюда с помощью +</p></Stack>
                        }

                    </Tabs>
                </Stack>
                : <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    Выберете задание в меню слева
                </Box>
            }
        </Sheet >
    )
}
export default LessonEdit;
//lesson={lesson} setLesson={setLesson} index={index}