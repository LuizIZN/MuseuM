BEGIN;

-- Criação do schema
CREATE SCHEMA IF NOT EXISTS museum;
SET search_path TO museum;

-- Tabela base para funcionários
CREATE TABLE IF NOT EXISTS funcionario (
    id SERIAL PRIMARY KEY, -- O PostgreSQL gera automaticamente valores únicos para `id`
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(45) NOT NULL UNIQUE
);

-- Tabela para gerentes (especialização de funcionário)
CREATE TABLE IF NOT EXISTS gerente (
    id SERIAL PRIMARY KEY,
    funcionario_id INTEGER UNIQUE NOT NULL REFERENCES funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Adiciona a coluna `gerente_id` à tabela `funcionario`
ALTER TABLE funcionario ADD COLUMN gerente_id INTEGER REFERENCES gerente (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Tabela para atendentes (especialização de funcionário)
CREATE TABLE IF NOT EXISTS atendente (
    id SERIAL PRIMARY KEY,
    funcionario_id INTEGER UNIQUE NOT NULL REFERENCES funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para diretores (especialização de funcionário)
CREATE TABLE IF NOT EXISTS diretor (
    id SERIAL PRIMARY KEY,
    funcionario_id INTEGER UNIQUE NOT NULL REFERENCES funcionario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para visitantes
CREATE TABLE IF NOT EXISTS visitante (
    id SERIAL PRIMARY KEY,
    email VARCHAR(45) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    atendente_id INTEGER NOT NULL REFERENCES atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para pessoas físicas (especialização de visitante)
CREATE TABLE IF NOT EXISTS pessoafisica (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(70) NOT NULL,
    visitante_id INTEGER NOT NULL REFERENCES visitante (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para pessoas jurídicas (especialização de visitante)
CREATE TABLE IF NOT EXISTS pessoajuridica (
    id SERIAL PRIMARY KEY,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    razao_social VARCHAR(70) NOT NULL,
    visitante_id INTEGER NOT NULL REFERENCES visitante (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para doações
CREATE TABLE IF NOT EXISTS doacao (
    id SERIAL PRIMARY KEY,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id INTEGER REFERENCES visitante (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela para itens do museu
CREATE TABLE IF NOT EXISTS item (
    id SERIAL PRIMARY KEY,
    cod_item VARCHAR(7) NOT NULL UNIQUE,
    nome VARCHAR(50) NOT NULL,
    estadoconservacao VARCHAR(50) NOT NULL,
    classificacao VARCHAR(50) NOT NULL,
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    doacao_id INTEGER REFERENCES doacao (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela para vendas
CREATE TABLE IF NOT EXISTS venda (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id INTEGER NOT NULL REFERENCES pessoafisica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para itens vendidos
CREATE TABLE IF NOT EXISTS vendaitem (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER NOT NULL REFERENCES venda (id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id INTEGER NOT NULL REFERENCES item (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (venda_id, item_id)
);

-- Tabela para visitas
CREATE TABLE IF NOT EXISTS visita (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    atendente_id INTEGER NOT NULL REFERENCES atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    visitante_id INTEGER NOT NULL REFERENCES pessoafisica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para contratos
CREATE TABLE IF NOT EXISTS contrato (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    pessoa_juridica_id INTEGER NOT NULL REFERENCES pessoajuridica (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para empréstimos
CREATE TABLE IF NOT EXISTS emprestimo (
    id SERIAL PRIMARY KEY,
    cod_emprestimo VARCHAR(7) NOT NULL UNIQUE,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE NOT NULL CHECK (data_devolucao > data_emprestimo),
    visitante_id INTEGER NOT NULL REFERENCES visitante (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    atendente_id INTEGER NOT NULL REFERENCES atendente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para eventos
CREATE TABLE IF NOT EXISTS evento (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(60) NOT NULL,
    tipo VARCHAR(60),
    horario TIME NOT NULL,
    coordenador VARCHAR(70),
    duracao VARCHAR(70) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    diretor_id INTEGER NOT NULL REFERENCES diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para exposições
CREATE TABLE IF NOT EXISTS exposicao (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    dias DATE[] NOT NULL,
    descricao VARCHAR(200),
    diretor_id INTEGER NOT NULL REFERENCES diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para participação de itens em exposições
CREATE TABLE IF NOT EXISTS participacaoitemexp (
    id SERIAL PRIMARY KEY,
    exposicao_id INTEGER NOT NULL REFERENCES exposicao (id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id INTEGER NOT NULL REFERENCES item (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (exposicao_id, item_id)
);

-- Tabela para notícias
CREATE TABLE IF NOT EXISTS noticia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    texto VARCHAR(500) NOT NULL,
    palavraschave VARCHAR(50)[],
    diretor_id INTEGER NOT NULL REFERENCES diretor (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para horário de funcionamento
CREATE TABLE IF NOT EXISTS horariofuncionamento (
    id SERIAL PRIMARY KEY,
    horainicio TIME NOT NULL,
    horafim TIME NOT NULL CHECK (horafim > horainicio),
    diascomerciais DATE[] NOT NULL,
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tabela para manutenções
CREATE TABLE IF NOT EXISTS manutencao (
    id SERIAL PRIMARY KEY,
    numidtecnico INTEGER NOT NULL,
    nometecnico VARCHAR(45) NOT NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    gerente_id INTEGER NOT NULL REFERENCES gerente (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    item_id INTEGER NOT NULL REFERENCES item (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Commit da transação
COMMIT;
