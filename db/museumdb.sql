BEGIN;

CREATE SCHEMA museum;

-- Tabela base para funcionários
CREATE TABLE IF NOT EXISTS museum.funcionario (
    id serial PRIMARY KEY,
    nome varchar(100) NOT NULL,
    senha varchar(255) NOT NULL,
    email varchar(45) NOT NULL UNIQUE
);

-- Tabela para gerentes (especialização de funcionário)
CREATE TABLE IF NOT EXISTS museum.gerente (
    id serial PRIMARY KEY,
    funcionario_id integer UNIQUE NOT NULL REFERENCES museum.funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE museum.funcionario ADD COLUMN gerente_id integer REFERENCES museum.gerente (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Tabela para atendentes (especialização de funcionário)
CREATE TABLE IF NOT EXISTS museum.atendente (
    id serial PRIMARY KEY,
    funcionario_id integer UNIQUE NOT NULL REFERENCES museum.funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para diretores (especialização de funcionário)
CREATE TABLE IF NOT EXISTS museum.diretor (
    id serial PRIMARY KEY,
    funcionario_id integer UNIQUE NOT NULL REFERENCES museum.funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para visitantes
CREATE TABLE IF NOT EXISTS museum.visitante (
    id serial PRIMARY KEY,
    email varchar(45) NOT NULL UNIQUE,
    telefone varchar(20) NOT NULL,
    endereco varchar(100) NOT NULL,
    atendente_id integer NOT NULL REFERENCES museum.atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para pessoas físicas (especialização de visitante)
CREATE TABLE IF NOT EXISTS museum.pessoafisica (
    id serial PRIMARY KEY,
    cpf varchar(14) NOT NULL UNIQUE,
    nome varchar(70) NOT NULL,
    visitante_id integer NOT NULL REFERENCES museum.visitante (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para pessoas jurídicas (especialização de visitante)
CREATE TABLE IF NOT EXISTS museum.pessoajuridica (
    id serial PRIMARY KEY,
    cnpj varchar(18) NOT NULL UNIQUE,
    razao_social varchar(70) NOT NULL,
    visitante_id integer NOT NULL REFERENCES museum.visitante (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para doações
CREATE TABLE IF NOT EXISTS museum.doacao (
    id serial PRIMARY KEY,
    valor numeric(10, 2) NOT NULL CHECK (valor > 0),
    data date NOT NULL DEFAULT CURRENT_DATE,
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id integer REFERENCES museum.visitante (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela para itens do museu
CREATE TABLE IF NOT EXISTS museum.item (
    id serial PRIMARY KEY,
    cod_item varchar(7) NOT NULL UNIQUE,
    nome varchar(50) NOT NULL,
    estadoconservacao varchar(50) NOT NULL,
    classificacao varchar(50) NOT NULL,
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    doacao_id integer REFERENCES museum.doacao (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela para vendas
CREATE TABLE IF NOT EXISTS museum.venda (
    id serial PRIMARY KEY,
    data date NOT NULL DEFAULT CURRENT_DATE,
    valor numeric(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id integer NOT NULL REFERENCES museum.pessoafisica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para itens vendidos
CREATE TABLE IF NOT EXISTS museum.vendaitem (
    id serial PRIMARY KEY,
    venda_id integer NOT NULL REFERENCES museum.venda (id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id integer NOT NULL REFERENCES museum.item (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (venda_id, item_id)
);

-- Tabela para visitas
CREATE TABLE IF NOT EXISTS museum.visita (
    id serial PRIMARY KEY,
    data date NOT NULL DEFAULT CURRENT_DATE,
    hora time NOT NULL DEFAULT CURRENT_TIME,
    atendente_id integer NOT NULL REFERENCES museum.atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id integer NOT NULL REFERENCES museum.pessoafisica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para contratos
CREATE TABLE IF NOT EXISTS museum.contrato (
    id serial PRIMARY KEY,
    descricao varchar(200) NOT NULL,
    valor numeric(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    pessoa_juridica_id integer NOT NULL REFERENCES museum.pessoajuridica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para empréstimos
CREATE TABLE IF NOT EXISTS museum.emprestimo (
    id serial PRIMARY KEY,
    cod_emprestimo varchar(7) NOT NULL UNIQUE,
    data_emprestimo date NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao date NOT NULL CHECK (data_devolucao > data_emprestimo),
    visitante_id integer NOT NULL REFERENCES museum.visitante (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    atendente_id integer NOT NULL REFERENCES museum.atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para eventos
CREATE TABLE IF NOT EXISTS museum.evento (
    id serial PRIMARY KEY,
    titulo varchar(60) NOT NULL,
    tipo varchar(60),
    horario time NOT NULL,
    coordenador varchar(70),
    duracao varchar(70) NOT NULL,
    descricao varchar(200) NOT NULL,
    diretor_id integer NOT NULL REFERENCES museum.diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para exposições
CREATE TABLE IF NOT EXISTS museum.exposicao (
    id serial PRIMARY KEY,
    titulo varchar(50) NOT NULL,
    dias date[] NOT NULL,
    descricao varchar(200),
    diretor_id integer NOT NULL REFERENCES museum.diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para participação de itens em exposições
CREATE TABLE IF NOT EXISTS museum.participacaoitemexp (
    id serial PRIMARY KEY,
    exposicao_id integer NOT NULL REFERENCES museum.exposicao (id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id integer NOT NULL REFERENCES museum.item (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (exposicao_id, item_id)
);

-- Tabela para notícias
CREATE TABLE IF NOT EXISTS museum.noticia (
    id serial PRIMARY KEY,
    titulo varchar(50) NOT NULL,
    texto varchar(500) NOT NULL,
    palavraschave varchar(50)[],
    diretor_id integer NOT NULL REFERENCES museum.diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para horário de funcionamento
CREATE TABLE IF NOT EXISTS museum.horariofuncionamento (
    id serial PRIMARY KEY,
    horainicio time NOT NULL,
    horafim time NOT NULL CHECK (horafim > horainicio),
    diascomerciais date[] NOT NULL,
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para manutenções
CREATE TABLE IF NOT EXISTS museum.manutencao (
    id serial PRIMARY KEY,
    numidtecnico integer NOT NULL,
    nometecnico varchar(45) NOT NULL,
    data date NOT NULL DEFAULT CURRENT_DATE,
    descricao varchar(200) NOT NULL,
    valor numeric(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id integer NOT NULL REFERENCES museum.gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    item_id integer NOT NULL REFERENCES museum.item (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Commit da transação
COMMIT;