import { Information } from "@/services/shared/Information";
import important_json from "@/utils/magic/regex/important.json";

interface CategorizedMessages {
  importantMessages: (Information & { matchCount: number; matchingWords: string[], important: true })[];
  normalMessages: Information[];
}

export const categorizeMessages = (messages: Information[]): CategorizedMessages => {
  const importantMessages: CategorizedMessages["importantMessages"] = [];
  const normalMessages: CategorizedMessages["normalMessages"] = [];

  messages.forEach((message) => {
    const { title, content, read } = message;
    let matchCount = 0;
    const matchingWords: string[] = [];

    Object.values(important_json).forEach((regexArray: string[]) => {
      regexArray.forEach((regex) => {
        const pattern = new RegExp(regex, "i");
        const titleMatches = title && title.match(pattern);
        const contentMatches = content.match(pattern);

        // Filter out empty strings and add only non-empty matches to matchingWords
        if (titleMatches) {
          const nonEmptyTitleMatches = titleMatches.filter((match) => match && match.trim() !== "");
          if (nonEmptyTitleMatches.length > 0) {
            matchCount++;
            matchingWords.push(...nonEmptyTitleMatches);
          }
        }

        if (contentMatches) {
          const nonEmptyContentMatches = contentMatches.filter((match) => match && match.trim() !== "");
          if (nonEmptyContentMatches.length > 0) {
            matchCount++;
            matchingWords.push(...nonEmptyContentMatches);
          }
        }
      });
    });

    if (!message.title) {
      message.title = "Sans titre";
    }

    if (matchCount > 0 && !read) {
      importantMessages.push({ ...message, matchCount, matchingWords, important: true });

      // Log the matching words or phrases for this message
      console.log(`Message Title: "${title}" matched the following words:`, matchingWords);
    } else {
      normalMessages.push(message);
    }
  });

  const limitedImportantMessages = importantMessages.slice(0, 3);

  return { importantMessages: limitedImportantMessages, normalMessages };
};
