import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { Avatar, Box, Button, CssBaseline, Grid, IconButton, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Sheet, Typography } from "@mui/joy";
import { AccountCircleOutlined, KeyboardArrowRight, Logout, People, Task } from "@mui/icons-material";

import ModeToggle from "../components/ModeToggle";

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const toTasks = async () => { navigate('/') }
    const logout = async () => {
        setAuth({});
        navigate('/login');
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/api/v1/users/getAll',
                    {
                        params: {
                            page: 1,
                        },
                    });
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])


    return (
        <main style={{ width: "100vw", height: "100vh" }}>
            <CssBaseline />
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 20,
                paddingRight: 20,
                gap: 20,
                width: "100vw",
                height: "100vh"
            }}>
                <Sheet
                    variant="outlined"
                    sx={{
                        height: "95vh",
                        width: 250,
                        flexShrink: 0,
                        mx: 0, // margin left & right
                        my: 0, // margin top & bottom
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 'sm',
                        boxShadow: 'md',
                        justifyContent: "space-between"
                    }}>
                    <List
                        size="md"
                        sx={{
                            borderRadius: 'sm',
                            flexShrink: 0,
                            flexGrow: 0
                        }}>
                        <ListItem >
                            <ListItemButton selected>
                                <ListItemDecorator>
                                    <People />
                                </ListItemDecorator>
                                <ListItemContent>Пользователи</ListItemContent>
                                <KeyboardArrowRight />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton onClick={toTasks}>
                                <ListItemDecorator>
                                    <Task />
                                </ListItemDecorator>
                                <ListItemContent>Задания</ListItemContent>
                                <KeyboardArrowRight />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <List
                        size="md"
                        sx={{
                            borderRadius: 'sm',
                            flexShrink: 0,
                            flexGrow: 0
                        }}>
                        <ListItem>
                            <ListItemButton>
                                <ListItemDecorator>
                                    <AccountCircleOutlined />
                                </ListItemDecorator>
                                <ListItemContent>
                                    <Typography level="h5" component="h5">
                                        Ivan Ivanov
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton onClick={logout}>
                                <ListItemDecorator>
                                    <Logout />
                                </ListItemDecorator>
                                <ListItemContent>Выйти</ListItemContent>
                            </ListItemButton>
                        </ListItem>
                        <ModeToggle />
                    </List>
                </Sheet>
                <Sheet
                    sx={{
                        height: "95vh",
                        mx: 0, // margin left & right
                        my: 0, // margin top & bottom
                        py: 2, // padding top & bottom
                        px: 2, // padding left & right
                        flexGrow: 19,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 'sm',
                        boxShadow: 'md',
                    }}
                    variant="outlined">
                        <Typography level="h3" component="h3">
                            <b>Пользователи</b>
                        </Typography>
                        <Box sx={{ flexGrow: 1, flexShrink: 1, scrollbarWidth: "none", overflow: "scroll" }}>
                            {users?.length
                                ? (
                                    <List aria-labelledby="ellipsis-list-demo"
                                        sx={{ '--ListItemDecorator-size': '56px' }}>
                                        {users.map((user, i) =>
                                            <ListItem key={i}>
                                                <ListItemDecorator>
                                                    <Avatar />
                                                </ListItemDecorator>
                                                <ListItemContent>
                                                    <Typography level="title-sm">{user?.name} {user?.surname}</Typography>
                                                    <Typography level="body-sm" noWrap>
                                                        {user?.email}
                                                    </Typography>
                                                </ListItemContent>
                                            </ListItem>
                                        )}
                                    </List>
                                ) : <p>Нет пользователей</p>
                            }
                        </Box>
                </Sheet>
            </div>
        </main>
    )
};

export default Users;