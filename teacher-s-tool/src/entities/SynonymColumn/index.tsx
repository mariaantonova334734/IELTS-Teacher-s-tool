import { useCallback, useEffect, useState } from 'react';
import { GetSynonymsResponse } from '../../api';
import { wordService } from '../../api/words/service/words.service';


/**
 * Столбец таблицы со страницы слов
 * 'Синонимы'
 */
export default function SynonymColumn({ wordId } : { wordId: string }) {
	const [synonyms, setSynonyms] = useState<GetSynonymsResponse>([]);
	const uploadSynonyms = useCallback(async () => {
		return await wordService.getSynonyms({
			wordId
		})
			.then((synonyms) => {
				setSynonyms(synonyms);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}, [wordId]);

	useEffect(() => {
		uploadSynonyms();
	}, [uploadSynonyms]);

	return (
		<div>
			{synonyms.map((synonym) => (
				<li key={synonym.id}>{synonym.title}</li>
			))}
		</div>
	);
}