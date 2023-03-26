export const SCORE_PROMPT = `Provide a score between 0 and 100 regarding the cyber ethics and digital rights of the company: $COMPANY. Return a number only.`;

export const PRODUCT_EXPLANATION_PROMPT = `Give a one paragraph explanation regarding the strengths of the cyber ethics and digital rights of the company: $COMPANY and
one paragraph explanation regarding the weaknesses of the cyber ethics and digital rights of the company: $COMPANY. 
Finally a one paragraph explanation regarding the overall state of the cyber ethics and digital rights of the company: $COMPANY. Be concise and use bullet points.`;

export const ALTERNATIVE_PROMPT = 'Find 3 alternative websites that are similar to the company: $COMPANY that have better cyber ethics and digital rights. They must score equal or better than $COMPANY between 0 and 100. Only reply with the name and score.';

export const TYPE_DATA_PROMPT = 'What type of data does $COMPANY collect from its users? Reply concisely and separate the types with commas.';

export const BREACHES_PROMPT = 'Give one short paragraph about the breach potential in $COMPANY\'s industry.';

export const RISK_PROMPT = 'What is the risk of data exposure using $COMPANY\'s services?';

export const LAST_BREACH_PROMPT = 'Tell me about the last data breach of $COMPANY.';

export const OPENAI_ENDPOINT_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

export async function fetchMetadata(company: string) {
	const responses = await Promise.all([
		fetch(OPENAI_ENDPOINT_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer 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'
			},
			body: JSON.stringify({
				prompt: [SCORE_PROMPT, PRODUCT_EXPLANATION_PROMPT, ALTERNATIVE_PROMPT].map(prompt => prompt.replaceAll('$COMPANY', company)),
				max_tokens: 2_000,
				n: 1,
				stop: '',
			}),
		}),
		fetch(OPENAI_ENDPOINT_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer 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'
			},
			body: JSON.stringify({
				prompt: [TYPE_DATA_PROMPT, BREACHES_PROMPT, RISK_PROMPT, LAST_BREACH_PROMPT].map(prompt => prompt.replaceAll('$COMPANY', company)),
				max_tokens: 2_000,
				n: 1,
				stop: '',
			}),
		})
	]);

	if (responses.some(response => !response.ok)) return null;

	const [first, second] = await Promise.all(responses.map(response => response.json()));

	const data = {
		score: parseInt(first.choices[0].text.trim()) || -1,
		explanation: first.choices[1].text.trim(),
		alternatives: first.choices[2].text.trim(),
		typeData: second.choices[0].text.trim(),
		breaches: second.choices[1].text.trim(),
		risk: second.choices[2].text.trim(),
		lastBreach: second.choices[3].text.trim(),
	};

	return data;
}