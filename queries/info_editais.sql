select

e.idEdital as id,
titulo,
DATE_FORMAT(data_inicio, '%Y-%m-%d %H:%i:%s') as dataInicio,
DATE_FORMAT(data_fim, '%Y-%m-%d %H:%i:%s') as dataFim,
CASE 
    WHEN e.data_inicio > NOW() THEN 'Em breve'
    WHEN NOW() BETWEEN e.data_inicio AND e.data_fim THEN 'Em andamento'
    ELSE 'Encerrado'
END AS statusText,
pais,
i.nome as instituicao

from edital as e
join editalInstituicao as ei on (e.idEdital = ei.idEdital)
join instituicao as i on (ei.idInstituicao = i.idInstituicao);