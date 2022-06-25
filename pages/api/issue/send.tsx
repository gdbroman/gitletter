import prisma from "../../../prisma/prisma";

// POST /api/issue/send
// Required fields in body: issueId, newsletterId
export default async function handle(req, res) {
  const { issueId } = req.body;

  if (req.method === "POST") {
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        sentAt: new Date(),
      },
    });
    res.json(result);
  }
}
