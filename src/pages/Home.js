import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { Box, Button, CssBaseline, IconButton, Stack, Typography } from "@mui/joy";


import { AccountCircleOutlined, LogoutOutlined } from "@mui/icons-material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import * as React from 'react';
import CoursePage from "./Course";
import useWindowDimensions from "../hooks/useWindowDimentions";
import Users from "./Users";
import ModeToggle from "../components/ModeToggle";
import LessonEdit from "../components/LessonEdit";


const Home = () => {
    const { height, width } = useWindowDimensions();
    const [user, setUser] = useState();
    const [lessonid, setLessonId] = useState(null);
    const [title, setTitle] = useState();
    const [lesson, setLesson] = useState(null);
    const [index, setIndex] = React.useState(0);
    const { setAuth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const getLessonEdit = async (lessonid) => {
        try {
            if (lessonid != null) {
                const response = await axiosPrivate.get(`/api/v1/lessons/get`,
                    {
                        params: {
                            id: lessonid,
                        },
                    }
                );
                response.data.pages = response.data.pages.sort((a, b) => (a.stepId > b.stepId) ? 1 : -1);
                console.log(response.data.pages);
                setLesson(response.data);
                setTitle(response.data.title)
            }
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    }
    


    const logout = async () => {
        setAuth({});
        navigate('/login');
    }
    useEffect(() => {
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get('/api/v1/users/get');
                setUser(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        getUser();
        getLessonEdit(lessonid);

        return () => {
            controller.abort();
        }
    }, [])


    return (
        <main style={{ width: "100vw", height: "100vh", minHeight:600, minWidth:1200, }}>
            <CssBaseline />
            <Tabs
                aria-label="Pipeline"
                value={index}
                sx={{
                    display: "flex",
                    flexDirection: "column"
                }}
                onChange={(event, value) => setIndex(value)}
            >
                <Box sx={{
                    display: "flex",
                    height: 52,
                    position: "fixed",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100vw",
                    justifyContent: "space-between",
                    borderBottom: '1px solid var(--joy-palette-neutral-300, #CDD7E1)',
                    px: 2
                }}>
                    <Box sx={{
                        display: "flex",
                        width: 250,
                        flexGrow: 2,
                        justifyContent: 'flex-start',
                        alignItems: "center",
                    }}>
                        <Typography level="h3">Физбот</Typography>
                    </Box>
                    <TabList disableUnderline
                        sx={(theme) => ({
                            height: 52,
                            flexGrow: 6,
                            justifyContent: 'center',
                            [`&& .${tabClasses.root}`]: {
                                flex: 'initial',
                                bgcolor: 'transparent',
                                '&:hover': {
                                    bgcolor: 'transparent',
                                },
                                [`&.${tabClasses.selected}`]: {
                                    color: 'primary.plainColor',
                                    '&::after': {
                                        height: 5,
                                        borderTopLeftRadius: 3,
                                        borderTopRightRadius: 3,
                                        bgcolor: 'primary.500',
                                    },
                                },
                            },
                        })}>
                        <Tab indicatorInset>
                            Курс
                        </Tab>
                        <Tab indicatorInset>
                            Пользователи
                        </Tab>
                    </TabList>
                    <Box sx={{
                        display: "flex",
                        gap: 0.5,
                        flexGrow: 2,
                        justifyContent: 'flex-end',
                        alignItems: "center",
                    }}>
                        <Button variant="plain"
                            color="neutral"
                            endDecorator={<AccountCircleOutlined />}>
                            {user?.name} {user?.surname}
                        </Button>
                        <ModeToggle />
                        <IconButton onClick={() => logout()} variant="soft">
                            <LogoutOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <Box
                    sx={(theme) => ({
                        width: "100vw",
                        top: 52,
                        height: height - 52,
                        position: "fixed",
                        scrollbarWidth: "none",
                        overflowY: "scroll",
                        '--bg': theme.vars.palette.background.surface,
                        background: 'var(--bg)',
                        boxShadow: '0 0 0 100vmax var(--bg)',
                        clipPath: 'inset(0 -100vmax)',
                    })}
                >
                    {index == 0 ?
                        <TabPanel value={0} sx={{ height: "100%", display: "flex" }}>
                            <Stack direction="row" sx={{
                                height: "100%",
                                flexGrow: 1,
                                gap: 2,
                            }}>
                                <CoursePage navigate={navigate} lessonid={lessonid} getLessonEdit={(id)=>{getLessonEdit(id)}} />
                                <LessonEdit lesson={lesson} title={title} setLesson={setLesson} setTitle={setTitle}></LessonEdit>
                            </Stack>
                        </TabPanel> :
                        <span></span>
                    }
                    {index == 1 ?
                        <TabPanel value={1}><Users navigate={navigate} /></TabPanel>
                        : <span></span>
                    }
                </Box>
            </Tabs>
        </main >
    )
}

export default Home