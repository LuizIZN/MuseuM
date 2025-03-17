BEGIN;

-- Inserções para a tabela funcionario (14 funcionários: 4 gerentes, 5 atendentes, 5 diretores)
INSERT INTO museum.funcionario (id, nome, senha, email) VALUES
(1, 'Gerente 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente2@email.com'),
(2, 'Gerente 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente3@email.com'),
(3, 'Gerente 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente4@email.com'),
(4, 'Gerente 5', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'gerente5@email.com'),
(5, 'Atendente 1', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente1@email.com'),
(6, 'Atendente 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente2@email.com'),
(7, 'Atendente 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente3@email.com'),
(8, 'Atendente 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente4@email.com'),
(9, 'Atendente 5', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'atendente5@email.com'),
(10, 'Diretor 1', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor1@email.com'),
(11, 'Diretor 2', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor2@email.com'),
(12, 'Diretor 3', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor3@email.com'),
(13, 'Diretor 4', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor4@email.com'),
(14, 'Diretor 5', '$2a$12$KFsHzqvxr69OzbziAAyBR.d9uKqSvn.G7s6VK9XpbEI/dTH76OBsG', 'diretor5@email.com');

-- Inserções para a tabela gerente (4 gerentes)
INSERT INTO museum.gerente (id, funcionario_id) VALUES 
(1, 1), (2, 2), (3, 3), (4, 4);

-- Inserções para a tabela atendente (5 atendentes)
INSERT INTO museum.atendente (id, funcionario_id) VALUES 
(1, 5), (2, 6), (3, 7), (4, 8), (5, 9);

-- Inserções para a tabela diretor (5 diretores)
INSERT INTO museum.diretor (id, funcionario_id) VALUES 
(1, 10), (2, 11), (3, 12), (4, 13), (5, 14);

UPDATE museum.funcionario SET gerente_id = 1 WHERE id = 1;
UPDATE museum.funcionario SET gerente_id = 2 WHERE id = 2;
UPDATE museum.funcionario SET gerente_id = 3 WHERE id = 3;
UPDATE museum.funcionario SET gerente_id = 4 WHERE id = 4;
UPDATE museum.funcionario SET gerente_id = 1 WHERE id = 5;
UPDATE museum.funcionario SET gerente_id = 2 WHERE id = 6;
UPDATE museum.funcionario SET gerente_id = 3 WHERE id = 7;
UPDATE museum.funcionario SET gerente_id = 4 WHERE id = 8;
UPDATE museum.funcionario SET gerente_id = 1 WHERE id = 9;
UPDATE museum.funcionario SET gerente_id = 2 WHERE id = 10;
UPDATE museum.funcionario SET gerente_id = 3 WHERE id = 11;
UPDATE museum.funcionario SET gerente_id = 4 WHERE id = 12;
UPDATE museum.funcionario SET gerente_id = 1 WHERE id = 13;
UPDATE museum.funcionario SET gerente_id = 2 WHERE id = 14;

-- Inserções para a tabela visitante (10 visitantes)
INSERT INTO museum.visitante (id, email, telefone, endereco, atendente_id) VALUES
(1, 'pf1@email.com', '1111-1111', 'Endereço PF1', 1),
(2, 'pf2@email.com', '2222-2222', 'Endereço PF2', 2),
(3, 'pf3@email.com', '3333-3333', 'Endereço PF3', 3),
(4, 'pf4@email.com', '4444-4444', 'Endereço PF4', 4),
(5, 'pf5@email.com', '5555-5555', 'Endereço PF5', 5),
(6, 'pj1@email.com', '6666-6666', 'Endereço PJ1', 1),
(7, 'pj2@email.com', '7777-7777', 'Endereço PJ2', 2),
(8, 'pj3@email.com', '8888-8888', 'Endereço PJ3', 3),
(9, 'pj4@email.com', '9999-9999', 'Endereço PJ4', 4),
(10, 'pj5@email.com', '0000-0000', 'Endereço PJ5', 5);

-- Inserções para pessoafisica (5 pessoas físicas)
INSERT INTO museum.pessoafisica (id, cpf, nome, visitante_id) VALUES
(1, '111.111.111-11', 'PF1 Nome', 1),
(2, '222.222.222-22', 'PF2 Nome', 2),
(3, '333.333.333-33', 'PF3 Nome', 3),
(4, '444.444.444-44', 'PF4 Nome', 4),
(5, '555.555.555-55', 'PF5 Nome', 5);

-- Inserções para pessoajuridica (5 pessoas jurídicas)
INSERT INTO museum.pessoajuridica (id, cnpj, razao_social, visitante_id) VALUES
(1, '11.111.111/0001-11', 'PJ1 Razão Social', 6),
(2, '22.222.222/0001-22', 'PJ2 Razão Social', 7),
(3, '33.333.333/0001-33', 'PJ3 Razão Social', 8),
(4, '44.444.444/0001-44', 'PJ4 Razão Social', 9),
(5, '55.555.555/0001-55', 'PJ5 Razão Social', 10);

-- Inserções para doacao (5 doações)
INSERT INTO museum.doacao (id, valor, data, gerente_id, visitante_id) VALUES
(1, 100.00, '2024-01-01', 1, 1),
(2, 200.00, '2024-02-01', 2, 2),
(3, 300.00, '2024-03-01', 3, 3),
(4, 400.00, '2024-04-01', 4, 4),
(5, 500.00, '2024-05-01', 4, 5);

-- Inserções para item (5 itens)
INSERT INTO museum.item (id, cod_item, nome, estadoconservacao, classificacao, gerente_id, doacao_id) VALUES
(1, 'ITEM001', 'Quadro Antigo', 'Bom', 'Arte', 1, 1),
(2, 'ITEM002', 'Escultura', 'Excelente', 'Escultura', 2, 2),
(3, 'ITEM003', 'Moeda Rara', 'Regular', 'Numismática', 3, 3),
(4, 'ITEM004', 'Vaso Antigo', 'Ruim', 'Cerâmica', 4, 4),
(5, 'ITEM005', 'Livro Raro', 'Bom', 'Literatura', 4, 5);

-- Inserções para venda (5 vendas)
INSERT INTO museum.venda (id, data, valor, gerente_id, visitante_id) VALUES
(1, '2024-01-10', 500.00, 1, 1),
(2, '2024-02-15', 750.00, 2, 2),
(3, '2024-03-20', 300.00, 3, 3),
(4, '2024-04-25', 450.00, 4, 4),
(5, '2024-05-30', 600.00, 4, 5);

-- Inserções para vendaitem (5 itens vendidos)
INSERT INTO museum.vendaitem (id, venda_id, item_id) VALUES
(1, 1, 1), (2, 2, 2), (3, 3, 3), (4, 4, 4), (5, 5, 5);

-- Inserções para visita (5 visitas)
INSERT INTO museum.visita (id, data, hora, atendente_id, visitante_id) VALUES
(1, '2024-01-05', '10:00:00', 1, 1),
(2, '2024-02-10', '11:30:00', 2, 2),
(3, '2024-03-15', '14:00:00', 3, 3),
(4, '2024-04-20', '15:45:00', 4, 4),
(5, '2024-05-25', '09:15:00', 5, 5);

-- Inserções para contrato (5 contratos)
INSERT INTO museum.contrato (id, descricao, valor, gerente_id, pessoa_juridica_id) VALUES
(1, 'Contrato 1', 1000.00, 1, 1),
(2, 'Contrato 2', 2000.00, 2, 2),
(3, 'Contrato 3', 1500.00, 3, 3),
(4, 'Contrato 4', 3000.00, 4, 4),
(5, 'Contrato 5', 2500.00, 4, 5);

-- Inserções para emprestimo (5 empréstimos)
INSERT INTO museum.emprestimo (id, cod_emprestimo, data_emprestimo, data_devolucao, visitante_id, atendente_id) VALUES
(1, 'EMP001', '2024-01-01', '2024-02-01', 1, 1),
(2, 'EMP002', '2024-02-01', '2024-03-01', 2, 2),
(3, 'EMP003', '2024-03-01', '2024-04-01', 3, 3),
(4, 'EMP004', '2024-04-01', '2024-05-01', 4, 4),
(5, 'EMP005', '2024-05-01', '2024-06-01', 5, 5);

-- Inserções para evento (5 eventos)
INSERT INTO museum.evento (id, titulo, tipo, horario, coordenador, duracao, descricao, diretor_id) VALUES
(1, 'Evento 1', 'Tipo 1', '10:00:00', 'Coordenador 1', '2 horas', 'Descrição 1', 1),
(2, 'Evento 2', 'Tipo 2', '11:00:00', 'Coordenador 2', '3 horas', 'Descrição 2', 2),
(3, 'Evento 3', 'Tipo 3', '12:00:00', 'Coordenador 3', '4 horas', 'Descrição 3', 3),
(4, 'Evento 4', 'Tipo 4', '13:00:00', 'Coordenador 4', '5 horas', 'Descrição 4', 4),
(5, 'Evento 5', 'Tipo 5', '14:00:00', 'Coordenador 5', '6 horas', 'Descrição 5', 5);

-- Inserções para exposicao (5 exposições)
INSERT INTO museum.exposicao (id, titulo, dias, descricao, diretor_id) VALUES
(1, 'Exposição 1', ARRAY[DATE '2024-01-01'], 'Descrição 1', 1),
(2, 'Exposição 2', ARRAY[DATE '2024-02-01'], 'Descrição 2', 2),
(3, 'Exposição 3', ARRAY[DATE '2024-03-01'], 'Descrição 3', 3),
(4, 'Exposição 4', ARRAY[DATE '2024-04-01'], 'Descrição 4', 4),
(5, 'Exposição 5', ARRAY[DATE '2024-05-01'], 'Descrição 5', 5);

-- Inserções para participacaoitemexp (5 participações)
INSERT INTO museum.participacaoitemexp (id, exposicao_id, item_id) VALUES
(1, 1, 1), (2, 2, 2), (3, 3, 3), (4, 4, 4), (5, 5, 5);

-- Inserções para noticia (5 notícias)
INSERT INTO museum.noticia (id, titulo, texto, palavraschave, diretor_id) VALUES
(1, 'Notícia 1', 'Texto 1', ARRAY['palavra1'], 1),
(2, 'Notícia 2', 'Texto 2', ARRAY['palavra2'], 2),
(3, 'Notícia 3', 'Texto 3', ARRAY['palavra3'], 3),
(4, 'Notícia 4', 'Texto 4', ARRAY['palavra4'], 4),
(5, 'Notícia 5', 'Texto 5', ARRAY['palavra5'], 5);

-- Inserções para horariofuncionamento (5 horários)
INSERT INTO museum.horariofuncionamento (id, horainicio, horafim, diascomerciais, gerente_id) VALUES
(1, '09:00:00', '18:00:00', ARRAY[DATE '2024-01-01'], 1),
(2, '08:00:00', '17:00:00', ARRAY[DATE '2024-02-01'], 2),
(3, '10:00:00', '19:00:00', ARRAY[DATE '2024-03-01'], 3),
(4, '07:00:00', '16:00:00', ARRAY[DATE '2024-04-01'], 4),
(5, '08:30:00', '20:00:00', ARRAY[DATE '2024-05-01'], 4);

-- Inserções para manutencao (5 manutenções)
INSERT INTO museum.manutencao (id, numidtecnico, nometecnico, data, descricao, valor, gerente_id, item_id) VALUES
(1, 101, 'Técnico 1', '2024-01-01', 'Descrição 1', 100.00, 1, 1),
(2, 102, 'Técnico 2', '2024-02-01', 'Descrição 2', 200.00, 2, 2),
(3, 103, 'Técnico 3', '2024-03-01', 'Descrição 3', 300.00, 3, 3),
(4, 104, 'Técnico 4', '2024-04-01', 'Descrição 4', 400.00, 4, 4),
(5, 105, 'Técnico 5', '2024-05-01', 'Descrição 5', 500.00, 4, 5);

COMMIT;
