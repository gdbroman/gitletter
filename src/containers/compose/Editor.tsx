import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import Card from "@mui/material/Card";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import { useThemeContext } from "../../contexts/theme";

export const Editor = ({ value, onChange, onBlur }) => {
  const { isDarkMode } = useThemeContext();

  return (
    <Card variant="outlined">
      <CodeMirror
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        theme={isDarkMode ? githubDark : githubLight}
        extensions={[
          EditorView.lineWrapping,
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
        ]}
      />
    </Card>
  );
};
