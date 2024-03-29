import { faker } from "@faker-js/faker";

import {
  createFrontMatter,
  getFrontMatterFromContent,
  getTimeAgoString,
  getTitleFromContent,
  isValidEmail,
  stringToMarkdownFileName,
  stripFrontMatterFromContent,
} from "../strings";

const generateFakeValidIssueContent = (overrideTitle?: string) =>
  [
    "---",
    `title: ${overrideTitle ?? faker.lorem.sentence(3)}`,
    "---",
    faker.lorem.paragraph(),
  ].join("\n\n");

const contentWithInvalidFrontMatter: string[] = [
  ["", "---", "title: A title", "---", faker.lorem.sentences()],
  ["---", "title: A title", "", faker.lorem.sentences()],
  ["title: A title", "---"],
  ["date: 2028-01-01", "---", ""],
  ["---", "title: This is a title", "", faker.lorem.sentences()],
  ["---", "No frontmatter here", "", faker.lorem.sentences()],
  ["---", "date: 2028-07-09", "", faker.lorem.sentences()],
].map((frontMatter) => frontMatter.join("\n\n"));

describe("getTitleFromContent", () => {
  const contentWithValidFrontMatter = [
    ["My title", generateFakeValidIssueContent("My title")],
    ["Another title", generateFakeValidIssueContent("Another title")],
  ];

  it.each(contentWithValidFrontMatter)(
    "returns the title for valid frontmatter",
    (title, content) => {
      expect(getTitleFromContent(content)).toBe(title);
    }
  );

  it.each(contentWithInvalidFrontMatter)(
    "returns null for invalid frontmatter",
    (content) => {
      expect(getTitleFromContent(content)).toBeNull();
    }
  );
});

describe("getFrontMatterFromContent", () => {
  const contentAndValidFrontMatter: [string, string[]][] = [
    [["---", "---"], []],
    [["---", "title: A title", "---"], ["title: A title"]],
    [["---", "date: 2028-01-01", "---"], ["date: 2028-01-01"]],
    [
      ["---", "title: A title", "date: 2028-01-01", "---"],
      ["title: A title", "date: 2028-01-01"],
    ],
  ].map(([content, frontMatter]) => [content.join("\n\n"), frontMatter]);

  it.each(contentAndValidFrontMatter)(
    "returns the frontmatter from valid content",
    (content, frontMatter) => {
      expect(getFrontMatterFromContent(content)).toEqual(frontMatter);
    }
  );

  it.each(contentWithInvalidFrontMatter)(
    "returns null for invalid frontmatter",
    (content) => {
      expect(getFrontMatterFromContent(content)).toBeNull();
    }
  );
});

describe("createFrontMatter", () => {
  it("returns a valid frontmatter", () => {
    const title = faker.lorem.sentence(3);
    const frontMatter = createFrontMatter(title);
    expect(frontMatter).toEqual(["---", `title: ${title}`, "---"].join("\n"));
  });
});

describe("stringToMarkdownFileName", () => {
  const validStringsAndTitles = [
    ["My title", "my-title.md"],
    ["just a string", "just-a-string.md"],
    ["1234", "1234.md"],
    ["already-correct.md", "already-correct.md"],
  ];

  it.each(validStringsAndTitles)(
    "returns a valid markdown file name",
    (string, fileName) => {
      expect(stringToMarkdownFileName(string)).toBe(fileName);
    }
  );
});

describe("stripFrontMatterFromContent", () => {
  const validFrontMatterAndContent: [string, string][] = [
    [["---", "title: A title", "---", "", "Content"], "Content"],
    [["---", "title: A title", "---", ""], ""],
  ].map(([content, contentWithoutFrontMatter]) => [
    (content as string[]).join("\n\n"),
    contentWithoutFrontMatter as string,
  ]);

  it.each(validFrontMatterAndContent)(
    "returns the content without frontmatter",
    (content, contentWithoutFrontMatter) => {
      expect(stripFrontMatterFromContent(content)).toEqual(
        contentWithoutFrontMatter
      );
    }
  );
});

describe("getTimeAgoString", () => {
  it('returns "1 second ago" for 1 second ago', () => {
    const date = new Date(Date.now() - 1000);
    expect(getTimeAgoString(date)).toBe("1 second ago");
  });

  it("returns 2 seconds ago for 2 seconds ago", () => {
    const date = new Date(Date.now() - 2000);
    expect(getTimeAgoString(date)).toBe("2 seconds ago");
  });

  it('returns "1 minute ago" for 1 minute ago', () => {
    const date = new Date(Date.now() - 60000);
    expect(getTimeAgoString(date)).toBe("1 minute ago");
  });

  it("returns 2 minutes ago for 2 minutes ago", () => {
    const date = new Date(Date.now() - 120000);
    expect(getTimeAgoString(date)).toBe("2 minutes ago");
  });

  it('returns "1 hour ago" for 1 hour ago', () => {
    const date = new Date(Date.now() - 3600000);
    expect(getTimeAgoString(date)).toBe("1 hour ago");
  });

  it("returns 2 hours ago for 2 hours ago", () => {
    const date = new Date(Date.now() - 7200000);
    expect(getTimeAgoString(date)).toBe("2 hours ago");
  });

  it('returns "1 day ago" for 1 day ago', () => {
    const date = new Date(Date.now() - 86400000);
    expect(getTimeAgoString(date)).toBe("1 day ago");
  });

  it("returns 2 days ago for 2 days ago", () => {
    const date = new Date(Date.now() - 172800000);
    expect(getTimeAgoString(date)).toBe("2 days ago");
  });

  it('returns "1 month ago" for 1 month ago', () => {
    const date = new Date(Date.now() - 2629800000);
    expect(getTimeAgoString(date)).toBe("1 month ago");
  });

  it("returns 2 months ago for 2 months ago", () => {
    const date = new Date(Date.now() - 5259600000);
    expect(getTimeAgoString(date)).toBe("2 months ago");
  });
});

describe("isValidEmail", () => {
  it("returns true for a valid email", () => {
    expect(isValidEmail("hello@gmail.com")).toBe(true);
    expect(isValidEmail("x@proton.me")).toBe(true);
    expect(isValidEmail("x@y.me")).toBe(true);
  });
  it("returns false for an invalid email", () => {
    expect(isValidEmail("hello@gmail.c")).toBe(false);
    expect(isValidEmail("hello@gmail")).toBe(false);
    expect(isValidEmail("@gmail.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
