import { DarkMode, LightMode } from "@mui/icons-material";
import { Button, IconButton, useColorScheme } from "@mui/joy";
import React from "react";

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <IconButton
      variant="soft"
      sx={{ mx: 1, my: 1 }}
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
export default ModeToggle