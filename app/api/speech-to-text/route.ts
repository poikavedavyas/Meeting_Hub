import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const audioFile = formData.get("file") as File
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language,
    })

    return NextResponse.json({ text: transcription.text })
  } catch (err) {
    console.error("Whisper error:", err)
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
  }
}
