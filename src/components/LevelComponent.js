import { Add, Delete, Remove } from "@mui/icons-material"
import { IconButton, Input, List, ListItem, ListItemButton, ListItemContent, Stack, Step, StepIndicator, Typography } from "@mui/joy"
import { useState } from "react";



const LevelComponent = ({ level, ix, handleDeleteLvl, handleDeleteLesson, handleAddingLesson, getLessonEdit }) => {
    const [newLessonName, setNewLessonName] = useState('');

    return (
        <Step
            key={ix}
            indicator={
                <StepIndicator variant="solid" color="primary">
                    {level?.stepId}
                </StepIndicator>
            }>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ minWidth: 300 }}>

                <Typography level="h4">{level?.title}</Typography>
                <IconButton aria-label="Delete" size="sm" color="danger" onClick={() => {
                    handleDeleteLvl()
                }}>
                    <Delete />
                </IconButton>
            </Stack>
            <Stack spacing={1}>
                <List sx={{ maxWidth: 300}}>
                    {level?.lessons?.length
                        ? (<div>
                            {level?.lessons?.map((lesson, ilesson) =>
                                <ListItem variant="soft" sx={{py:1, mb:1}} key={ilesson}
                                    endAction={<IconButton onClick={()=>handleDeleteLesson(lesson.id)}><Remove></Remove></IconButton>}>
                                    <ListItemButton  onClick={() => {
                                        getLessonEdit(lesson.id);
                                    }
                                    }>{lesson.title}</ListItemButton>
                                </ListItem>
                            )}
                        </div>
                        ) : ""
                    }
                    <ListItem
                        startAction={
                            <IconButton aria-label="Add" size="sm" variant="plain" color="neutral" onClick={() => {
                                handleAddingLesson(level, newLessonName);
                                setNewLessonName('');
                            }}>
                                <Add />
                            </IconButton>
                        }>
                        <ListItemContent sx={{ paddingLeft: 4 }}>
                            <Input variant="plain"
                                placeholder="Тема шага"
                                value={newLessonName}
                                onChange={(e) => setNewLessonName(e.target.value)} />
                        </ListItemContent>
                    </ListItem>

                </List>
            </Stack>
        </Step>
    )
};

export default LevelComponent;