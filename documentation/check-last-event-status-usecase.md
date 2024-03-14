# CheckLastEventStatus UseCase

> ## Dados

- Id do grupo

> ## Fluxo Primário

1. Obter os dados do ultimo evento do grupo (data de termino e duração do mercado de notas)
2. retornar status "ativo" se o evento ainda não foi encerrado

> ## Fluxo Alternativo: Evento está no limite do encerramento
>
> 2. Retornar status "ativo"

> ## Fluxo Alternativo: Evento encerrado mas está dentro do período do mercado das notas
>
> 2. Retornar status "revisão"

> ## Fluxo Alternativo: Evento e mercado das notas encerrado
>
> 2. Retornar status "encerrado"

> ## Fluxo Alternativo: Grupo não tem nenhum evento marcado
>
> 2. Retornar status "encerrado"
