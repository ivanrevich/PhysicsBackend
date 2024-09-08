import { Box, Button, Checkbox, IconButton, Input, Radio, RadioGroup, Sheet, Stack, Typography } from "@mui/joy"
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { NumericFormat } from 'react-number-format';
import { Remove } from "@mui/icons-material";
import useWindowDimensions from "../hooks/useWindowDimentions";


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
                valueIsNumericString
            />
        );
    },
);

const FormComponent = ({ typeForm, setTypeForm, yesorno, setYesOrNo, value, setValue, answers, setAnswers, trueAnswers, setTrueAnswers, width, height }) => {
    const axiosPrivate = useAxiosPrivate();
    const [newElem, setNewElem] = useState();
    const handleAddNewElem = async () => {
        setAnswers([...answers, newElem]);
        setNewElem("");
    };
    const handleDelElem = async (value) => {
        setAnswers(answers.filter(el =>
            el !== value
        ));
        setTrueAnswers(
            trueAnswers.filter(el =>
                el !== value
            )
        );
    };

    const handleTrueAnswers = async (value) => {
        if (trueAnswers.includes(value)) {
            setTrueAnswers(
                trueAnswers.filter(el =>
                    el !== value
                )
            );
        } else {
            setTrueAnswers([...trueAnswers, value]);
        }
    };


    return (
        <Stack direction={"column"} sx={{ gap: 1, width: "50%" }}>
            <Typography level="body-xs"
                textTransform="uppercase"
                alignSelf={"flex-start"}
                paddingTop={0.5}
                paddingLeft={0.5}
                sx={{ letterSpacing: '0.15rem' }}>Форма ответа</Typography>
            <Typography level="body-sm"
                alignSelf={"flex-start"}
                paddingLeft={0.5}
                paddingBottom={1}>Выберете правильные варианты ответа</Typography>
            <RadioGroup
                orientation="horizontal"
                aria-labelledby="segmented-controls-example"
                name="justify"
                value={typeForm}
                onChange={(event) => setTypeForm(event.target.value)}
                sx={{
                    minHeight: 48,
                    padding: '4px',
                    display: "flex",
                    borderRadius: '12px',
                    bgcolor: 'neutral.softBg',
                    '--RadioGroup-gap': '4px',
                    '--Radio-actionRadius': '8px',
                    justifyContent: "center",
                    gap: 0.25,
                }}
            >
                {['Да / Нет', 'Выбор вариантов ответа', 'Посчитать'].map((item) => (
                    <Radio
                        key={item}
                        color="neutral"
                        value={item}
                        disableIcon
                        label={item}
                        variant="plain"
                        sx={{
                            justifyContent: "center",
                            flexGrow: 1,
                            px: 2,
                            textAlign: "center",
                            alignItems: 'center',
                            display: "flex",
                        }}
                        slotProps={{
                            action: ({ checked }) => ({
                                sx: {
                                    ...(checked && {
                                        bgcolor: 'background.surface',
                                        boxShadow: 'sm',
                                        '&:hover': {
                                            bgcolor: 'background.surface',
                                        },
                                    }),
                                },
                            }),
                        }}
                    />
                ))}
            </RadioGroup>


            {
                ('Да / Нет' === typeForm) ?
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        flexGrow: 1,
                        '& > div': { p: 2, borderRadius: 'md', display: 'flex' },
                    }}>
                        {
                            ["Да", "Нет"].map((el, idx) => (
                                <Sheet variant="outlined">
                                    <Radio overlay
                                        label={el}
                                        value={el}
                                        checked={(el == "Да" && yesorno == true) || (el == "Нет" && yesorno == false)}
                                        onChange={(e) => setYesOrNo(e.target.value == "Да")} />
                                </Sheet>
                            ))
                        }
                    </Box>
                    : <Box></Box>
            }

            {('Выбор вариантов ответа' === typeForm) ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexGrow: 1,
                    scrollbarWidth:"none",
                    maxHeight: height*0.5,
                    overflowY:"scroll",
                    '& > div': { borderRadius: 'md', display: 'flex' },
                }}>
                    {
                        answers.map((el, idx) => (
                            <Sheet variant="outlined" sx={{ p: 1, justifyContent: "space-between", alignItems: "center" }} flexDirection="row">
                                <Checkbox
                                    label={el}
                                    checked={trueAnswers.includes(el)}
                                    onChange={() => handleTrueAnswers(el)} />
                                <IconButton onClick={() => handleDelElem(el)}><Remove /></IconButton>
                            </Sheet>
                        ))
                    }
                    <Input
                        size="lg"
                        placeholder="введите вариант ответа"
                        type="email"
                        required
                        value={newElem}
                        onChange={(e) => setNewElem(e.target.value)}

                        endDecorator={
                            <Button
                                variant="solid"
                                color="primary"
                                type="submit"
                                onClick={() => handleAddNewElem()}
                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                                Добавить
                            </Button>
                        }
                    />
                </Box>
                : <Box></Box>
            }

            {('Посчитать' === typeForm) ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexGrow: 1,
                    '& > div': { borderRadius: 'md', display: 'flex' },
                }}>
                    <Input size="lg"
                        placeholder="Введите правильный ответ"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        slotProps={{
                            input: {
                                component: NumericFormatAdapter,
                            },
                        }} />
                </Box>
                : <Box></Box>
            }

        </Stack>
    )
}

export default FormComponent;