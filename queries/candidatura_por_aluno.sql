select

c.idCandidatura as id,
c.status,
DATE_FORMAT(c.data, '%Y-%m-%d %H:%i:%s') as data_candidatura,
titulo,
DATE_FORMAT(data_inicio, '%Y-%m-%d %H:%i:%s') as dataInicio,
DATE_FORMAT(data_fim, '%Y-%m-%d %H:%i:%s') as dataFim,
pais,
i.nome as instituicao,
e.idEdital as edital

from candidatura as c
join documento as d on (d.idCandidatura = c.idCandidatura)
join edital as e on (c.idEdital = e.idEdital)
join editalInstituicao as ei on (e.idEdital = ei.idEdital)
join instituicao as i on (ei.idInstituicao = i.idInstituicao)
;