import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import Card from "@mui/material/Card";
import CodeMirror from "@uiw/react-codemirror";

export const Editor = ({ value, onChange }) => (
  <Card
    variant="outlined"
    style={{
      flex: "1 1 auto",
      position: "relative",
      height: 0,
      maxHeight: "100%",
      overflowY: "scroll",
    }}
  >
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
      ]}
    />
  </Card>
);
