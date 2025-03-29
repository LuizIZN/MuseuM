BEGIN;

SET search_path TO museum;

-- Inserções para a tabela funcionario (14 funcionários: 4 gerentes, 5 atendentes, 5 diretores)
-- Remova a coluna `id` da inserção para permitir que o PostgreSQL gere automaticamente os valores
INSERT INTO funcionario (nome, senha, email) VALUES
('Gerente 1', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente1@email.com'),
('Gerente 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente2@email.com'),
('Gerente 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente3@email.com'),
('Gerente 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente4@email.com'),
('Atendente 1', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente1@email.com'),
('Atendente 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente2@email.com'),
('Atendente 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente3@email.com'),
('Atendente 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente4@email.com'),
('Atendente 5', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente5@email.com'),
('Diretor 1', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor1@email.com'),
('Diretor 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor2@email.com'),
('Diretor 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor3@email.com'),
('Diretor 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor4@email.com'),
('Diretor 5', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor5@email.com');

-- Inserções para a tabela gerente (4 gerentes)
INSERT INTO gerente (funcionario_id) VALUES 
(1), (2), (3), (4);

-- Inserções para a tabela atendente (5 atendentes)
INSERT INTO atendente (funcionario_id) VALUES 
(5), (6), (7), (8), (9);

-- Inserções para a tabela diretor (5 diretores)
INSERT INTO diretor (funcionario_id) VALUES 
(10), (11), (12), (13), (14);

-- Atualizações de gerente_id na tabela funcionario
UPDATE funcionario SET gerente_id = 1 WHERE id = 1;
UPDATE funcionario SET gerente_id = 2 WHERE id = 2;
UPDATE funcionario SET gerente_id = 3 WHERE id = 3;
UPDATE funcionario SET gerente_id = 4 WHERE id = 4;
UPDATE funcionario SET gerente_id = 1 WHERE id = 5;
UPDATE funcionario SET gerente_id = 2 WHERE id = 6;
UPDATE funcionario SET gerente_id = 3 WHERE id = 7;
UPDATE funcionario SET gerente_id = 4 WHERE id = 8;
UPDATE funcionario SET gerente_id = 1 WHERE id = 9;
UPDATE funcionario SET gerente_id = 2 WHERE id = 10;
UPDATE funcionario SET gerente_id = 3 WHERE id = 11;
UPDATE funcionario SET gerente_id = 4 WHERE id = 12;
UPDATE funcionario SET gerente_id = 1 WHERE id = 13;
UPDATE funcionario SET gerente_id = 2 WHERE id = 14;

-- Inserções para a tabela visitante (10 visitantes)
INSERT INTO visitante (email, telefone, endereco, atendente_id) VALUES
('pf1@email.com', '1111-1111', 'Endereço PF1', 1),
('pf2@email.com', '2222-2222', 'Endereço PF2', 2),
('pf3@email.com', '3333-3333', 'Endereço PF3', 3),
('pf4@email.com', '4444-4444', 'Endereço PF4', 4),
('pf5@email.com', '5555-5555', 'Endereço PF5', 5),
('pj1@email.com', '6666-6666', 'Endereço PJ1', 1),
('pj2@email.com', '7777-7777', 'Endereço PJ2', 2),
('pj3@email.com', '8888-8888', 'Endereço PJ3', 3),
('pj4@email.com', '9999-9999', 'Endereço PJ4', 4),
('pj5@email.com', '0000-0000', 'Endereço PJ5', 5);

-- Inserções para pessoafisica (5 pessoas físicas)
INSERT INTO pessoafisica (cpf, nome, visitante_id) VALUES
('111.111.111-11', 'PF1 Nome', 1),
('222.222.222-22', 'PF2 Nome', 2),
('333.333.333-33', 'PF3 Nome', 3),
('444.444.444-44', 'PF4 Nome', 4),
('555.555.555-55', 'PF5 Nome', 5);

-- Inserções para pessoajuridica (5 pessoas jurídicas)
INSERT INTO pessoajuridica (cnpj, razao_social, visitante_id) VALUES
('11.111.111/0001-11', 'PJ1 Razão Social', 6),
('22.222.222/0001-22', 'PJ2 Razão Social', 7),
('33.333.333/0001-33', 'PJ3 Razão Social', 8),
('44.444.444/0001-44', 'PJ4 Razão Social', 9),
('55.555.555/0001-55', 'PJ5 Razão Social', 10);

-- Inserções para doacao (5 doações)
INSERT INTO doacao (valor, data, gerente_id, visitante_id) VALUES
(100.00, '2024-01-01', 1, 1),
(200.00, '2024-02-01', 2, 2),
(300.00, '2024-03-01', 3, 3),
(400.00, '2024-04-01', 4, 4),
(500.00, '2024-05-01', 4, 5);

-- Inserções para item (5 itens)
INSERT INTO item (cod_item, nome, estadoconservacao, classificacao, gerente_id, doacao_id) VALUES
('ITEM001', 'Quadro Antigo', 'Bom', 'Arte', 1, 1),
('ITEM002', 'Escultura', 'Excelente', 'Escultura', 2, 2),
('ITEM003', 'Moeda Rara', 'Regular', 'Numismática', 3, 3),
('ITEM004', 'Vaso Antigo', 'Ruim', 'Cerâmica', 4, 4),
('ITEM005', 'Livro Raro', 'Bom', 'Literatura', 4, 5);

-- Inserções para venda (5 vendas)
INSERT INTO venda (data, valor, gerente_id, visitante_id) VALUES
('2024-01-10', 500.00, 1, 1),
('2024-02-15', 750.00, 2, 2),
('2024-03-20', 300.00, 3, 3),
('2024-04-25', 450.00, 4, 4),
('2024-05-30', 600.00, 4, 5);

-- Inserções para vendaitem (5 itens vendidos)
INSERT INTO vendaitem (venda_id, item_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Inserções para visita (5 visitas)
INSERT INTO visita (data, hora, atendente_id, visitante_id) VALUES
('2024-01-05', '10:00:00', 1, 1),
('2024-02-10', '11:30:00', 2, 2),
('2024-03-15', '14:00:00', 3, 3),
('2024-04-20', '15:45:00', 4, 4),
('2024-05-25', '09:15:00', 5, 5);

-- Inserções para contrato (5 contratos)
INSERT INTO contrato (descricao, valor, gerente_id, pessoa_juridica_id) VALUES
('Contrato 1', 1000.00, 1, 1),
('Contrato 2', 2000.00, 2, 2),
('Contrato 3', 1500.00, 3, 3),
('Contrato 4', 3000.00, 4, 4),
('Contrato 5', 2500.00, 4, 5);

-- Inserções para emprestimo (5 empréstimos)
INSERT INTO emprestimo (cod_emprestimo, data_emprestimo, data_devolucao, visitante_id, atendente_id, item_id) VALUES
('EMP001', '2024-01-01', '2024-02-01', 1, 1, 1),
('EMP002', '2024-02-01', '2024-03-01', 2, 2, 2),
('EMP003', '2024-03-01', '2024-04-01', 3, 3, 3),
('EMP004', '2024-04-01', '2024-05-01', 4, 4, 4),
('EMP005', '2024-05-01', '2024-06-01', 5, 5, 5);

-- Inserções para evento (5 eventos)
INSERT INTO evento (titulo, tipo, horario, coordenador, duracao, descricao, diretor_id) VALUES
('Evento 1', 'Tipo 1', '10:00:00', 'Coordenador 1', '2 horas', 'Descrição 1', 1),
('Evento 2', 'Tipo 2', '11:00:00', 'Coordenador 2', '3 horas', 'Descrição 2', 2),
('Evento 3', 'Tipo 3', '12:00:00', 'Coordenador 3', '4 horas', 'Descrição 3', 3),
('Evento 4', 'Tipo 4', '13:00:00', 'Coordenador 4', '5 horas', 'Descrição 4', 4),
('Evento 5', 'Tipo 5', '14:00:00', 'Coordenador 5', '6 horas', 'Descrição 5', 5);

-- Inserções para exposicao (5 exposições)
INSERT INTO exposicao (titulo, dias, descricao, diretor_id) VALUES
('Exposição 1', ARRAY[DATE '2024-01-01'], 'Descrição 1', 1),
('Exposição 2', ARRAY[DATE '2024-02-01'], 'Descrição 2', 2),
('Exposição 3', ARRAY[DATE '2024-03-01'], 'Descrição 3', 3),
('Exposição 4', ARRAY[DATE '2024-04-01'], 'Descrição 4', 4),
('Exposição 5', ARRAY[DATE '2024-05-01'], 'Descrição 5', 5);

-- Inserções para participacaoitemexp (5 participações)
INSERT INTO participacaoitemexp (exposicao_id, item_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Inserções para noticia (5 notícias)
INSERT INTO noticia (titulo, texto, palavraschave, diretor_id) VALUES
('Notícia 1', 'Texto 1', ARRAY['palavra1'], 1),
('Notícia 2', 'Texto 2', ARRAY['palavra2'], 2),
('Notícia 3', 'Texto 3', ARRAY['palavra3'], 3),
('Notícia 4', 'Texto 4', ARRAY['palavra4'], 4),
('Notícia 5', 'Texto 5', ARRAY['palavra5'], 5);

-- Inserções para horariofuncionamento (5 horários)
INSERT INTO horariofuncionamento (horainicio, horafim, diascomerciais, gerente_id) VALUES
('09:00:00', '18:00:00', ARRAY[DATE '2024-01-01'], 1),
('08:00:00', '17:00:00', ARRAY[DATE '2024-02-01'], 2),
('10:00:00', '19:00:00', ARRAY[DATE '2024-03-01'], 3),
('07:00:00', '16:00:00', ARRAY[DATE '2024-04-01'], 4),
('08:30:00', '20:00:00', ARRAY[DATE '2024-05-01'], 4);

-- Inserções para manutencao (5 manutenções)
INSERT INTO manutencao (numidtecnico, nometecnico, data, descricao, valor, gerente_id, item_id) VALUES
(101, 'Técnico 1', '2024-01-01', 'Descrição 1', 100.00, 1, 1),
(102, 'Técnico 2', '2024-02-01', 'Descrição 2', 200.00, 2, 2),
(103, 'Técnico 3', '2024-03-01', 'Descrição 3', 300.00, 3, 3),
(104, 'Técnico 4', '2024-04-01', 'Descrição 4', 400.00, 4, 4),
(105, 'Técnico 5', '2024-05-01', 'Descrição 5', 500.00, 4, 5);

COMMIT;
