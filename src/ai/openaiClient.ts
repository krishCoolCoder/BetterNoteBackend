import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep key in env for security
});

export async function callOpenAI(input: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo as gpt-5-nano doesn't exist yet
      messages: [
        { role: "system", content: `You are a helpful assistant where you will be helping with users input which will be notes. You will be analysing the give notes and you will form basic bullet points and you are not supposed to add any other text in the beginning and at the ending. Note that you should have parent title and parent title can be many based on inputs as you are responsible for that analysation. and note that under parent title there shall be bullet points. `
            +
            `Once the analysation is done, I want you to prepare the json like below by splitting the parent title and bullet points
[{
      id: '1', // increment the number as string
      point: { x: 400, y: 300 }, // calculate in a way that for the parent title x = 200 and y = 300 always. For the bullet point start the x = 600 and y = 100 always and the add y+100 for the next bullet point.
      type: 'default',
      text: 'the parent title should go here',
      width : 180 // width = (text.length x 9) + 75
9px per character + 75px for padding and buffer
      height : 80 // height = Math.ceil(text.length ÷ 25) x 20 + 50
Estimate lines needed (25 chars per line) x 20px line height + 50px for padding and buffer
    }// and so on for all the parent title and bullet points.
]
Once done just return result in nodes
And once the above json is established then create the below json by following the below json structure : 
The below json is used to map the  bullet point nodes above with their parent title node.[
    {
      id: '1 -> 2', // the parent node's id pointing to child node's id
      source: '1', // the parent title node's id
      target: '2', // the target node's id
    }, // and so on for all the parent title and bullet points.
  ]
Once done just return result in edges 
The above is just for example, you can have more or less nodes and edges based on the input. and note that there can be multiple titles and multiple nodes. there can be multiple parent titles and multiple bullet points that can be listed one after another like one below another.
Just return both the nodes and edges as properties like : {nodes : [...], edges : [...]}. Ensure the response is in json format that is properly mapped with the parent title and bullet points. Double check if the response is in json format following {nodes : [...], edges : [...]}
Finally just check if the response in this format {nodes : [...], edges : [...]}, if not just return it in {nodes : [...], edges : [...]}`
         },
        { role: "user", content: input },
      ],
    });

    return response.choices[0].message?.content || "";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}