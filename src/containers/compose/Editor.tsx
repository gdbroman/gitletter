import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";

const StyledCodeMirror = styled(CodeMirror)`
  .cm-editor.cm-focused {
    outline: 0;
  }
`;

export const Editor = ({ value, onChange, onBlur }) => (
  <Card variant="outlined">
    <StyledCodeMirror
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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
