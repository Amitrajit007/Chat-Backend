import { Request, Response } from "express";
import { messageHistory } from "../service/messageHistory.service";
export const msgHistoryController = async (req: Request, res: Response) => {
  const data = await messageHistory({
    from: req.query.from as string,
    to: req.query.to as string,
    limit: Number(req.query.limit),
  });
  res.status(200).json(data);
};

// res.status(400).json({ error: "from and to are required" });
