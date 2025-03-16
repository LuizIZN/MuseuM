BEGIN;

-- Inserções para a tabela funcionario (15 funcionários: 5 gerentes, 5 atendentes, 5 diretores)
INSERT INTO museum.funcionario (nome, senha, email) VALUES
('Gerente 1', 'senha1', 'gerente1@email.com'),
('Gerente 2', 'senha2', 'gerente2@email.com'),
('Gerente 3', 'senha3', 'gerente3@email.com'),
('Gerente 4', 'senha4', 'gerente4@email.com'),
('Gerente 5', 'senha5', 'gerente5@email.com'),
('Atendente 1', 'senhaA1', 'atendente1@email.com'),
('Atendente 2', 'senhaA2', 'atendente2@email.com'),
('Atendente 3', 'senhaA3', 'atendente3@email.com'),
('Atendente 4', 'senhaA4', 'atendente4@email.com'),
('Atendente 5', 'senhaA5', 'atendente5@email.com'),
('Diretor 1', 'senhaD1', 'diretor1@email.com'),
('Diretor 2', 'senhaD2', 'diretor2@email.com'),
('Diretor 3', 'senhaD3', 'diretor3@email.com'),
('Diretor 4', 'senhaD4', 'diretor4@email.com'),
('Diretor 5', 'senhaD5', 'diretor5@email.com');

-- Inserções para a tabela gerente (5 gerentes)
INSERT INTO museum.gerente (funcionario_id) VALUES (1), (2), (3), (4), (5);

-- Inserções para a tabela atendente (5 atendentes)
INSERT INTO museum.atendente (funcionario_id) VALUES (6), (7), (8), (9), (10);

-- Inserções para a tabela diretor (5 diretores)
INSERT INTO museum.diretor (funcionario_id) VALUES (11), (12), (13), (14), (15);

-- Atualiza funcionario.gerente_id para apontar para o gerente 1 (simplificação)
UPDATE museum.funcionario SET gerente_id = 1;

-- Inserções para a tabela visitante (10 visitantes)
INSERT INTO museum.visitante (email, telefone, endereco, atendente_id) VALUES
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
INSERT INTO museum.pessoafisica (cpf, nome, visitante_id) VALUES
('111.111.111-11', 'PF1 Nome', 1),
('222.222.222-22', 'PF2 Nome', 2),
('333.333.333-33', 'PF3 Nome', 3),
('444.444.444-44', 'PF4 Nome', 4);
('555.555.555-55', 'PF5 Nome', 5);

-- Inserções para pessoajuridica (5 pessoas jurídicas)
INSERT INTO museum.pessoajuridica (cnpj, razao_social, visitante_id) VALUES
('11.111.111/0001-11', 'PJ1 Razão Social', 6),
('22.222.222/0001-22', 'PJ2 Razão Social', 7),
('33.333.333/0001-33', 'PJ3 Razão Social', 8),
('44.444.444/0001-44', 'PJ4 Razão Social', 9),
('55.555.555/0001-55', 'PJ5 Razão Social', 10);

-- Inserções para doacao (5 doações)
INSERT INTO museum.doacao (valor, data, gerente_id, visitante_id) VALUES
(100.00, '2024-01-01', 1, 1),
(200.00, '2024-02-01', 2, 2),
(300.00, '2024-03-01', 3, 3),
(400.00, '2024-04-01', 4, 4),
(500.00, '2024-05-01', 5, 5);

-- Inserções para item (5 itens)
INSERT INTO museum.item (cod_item, nome, estadoconservacao, classificacao, gerente_id, doacao_id) VALUES
('ITEM001', 'Quadro Antigo', 'Bom', 'Arte', 1, 1),
('ITEM002', 'Escultura', 'Excelente', 'Escultura', 2, 2),
('ITEM003', 'Moeda Rara', 'Regular', 'Numismática', 3, 3),
('ITEM004', 'Vaso Antigo', 'Ruim', 'Cerâmica', 4, 4),
('ITEM005', 'Livro Raro', 'Bom', 'Literatura', 5, 5);

-- Inserções para venda (5 vendas)
INSERT INTO museum.venda (data, valor, gerente_id, visitante_id) VALUES
('2024-01-10', 500.00, 1, 1),
('2024-02-15', 750.00, 2, 2),
('2024-03-20', 300.00, 3, 3),
('2024-04-25', 450.00, 4, 4),
('2024-05-30', 600.00, 5, 5);

-- Inserções para vendaitem (5 itens vendidos)
INSERT INTO museum.vendaitem (venda_id, item_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Inserções para visita (5 visitas)
INSERT INTO museum.visita (data, hora, atendente_id, visitante_id) VALUES
('2024-01-05', '10:00:00', 1, 1),
('2024-02-10', '11:30:00', 2, 2),
('2024-03-15', '14:00:00', 3, 3),
('2024-04-20', '15:45:00', 4, 4),
('2024-05-25', '09:15:00', 5, 5);

-- Inserções para contrato (5 contratos)
INSERT INTO museum.contrato (descricao, valor, gerente_id, pessoa_juridica_id) VALUES
('Contrato 1', 1000.00, 1, 1),
('Contrato 2', 2000.00, 2, 2),
('Contrato 3', 1500.00, 3, 3),
('Contrato 4', 3000.00, 4, 4),
('Contrato 5', 2500.00, 5, 5);

-- Inserções para emprestimo (5 empréstimos)
INSERT INTO museum.emprestimo (cod_emprestimo, data_emprestimo, data_devolucao, visitante_id, atendente_id) VALUES
('EMP001', '2024-01-01', '2024-02-01', 1, 1),
('EMP002', '2024-02-01', '2024-03-01', 2, 2),
('EMP003', '2024-03-01', '2024-04-01', 3, 3),
('EMP004', '2024-04-01', '2024-05-01', 4, 4),
('EMP005', '2024-05-01', '2024-06-01', 5, 5);

-- Inserções para evento (5 eventos)
INSERT INTO museum.evento (titulo, tipo, horario, coordenador, duracao, descricao, diretor_id) VALUES
('Evento 1', 'Tipo 1', '10:00:00', 'Coordenador 1', '2 horas', 'Descrição 1', 1),
('Evento 2', 'Tipo 2', '11:00:00', 'Coordenador 2', '3 horas', 'Descrição 2', 2),
('Evento 3', 'Tipo 3', '12:00:00', 'Coordenador 3', '4 horas', 'Descrição 3', 3),
('Evento 4', 'Tipo 4', '13:00:00', 'Coordenador 4', '5 horas', 'Descrição 4', 4),
('Evento 5', 'Tipo 5', '14:00:00', 'Coordenador 5', '6 horas', 'Descrição 5', 5);

-- Inserções para exposicao (5 exposições)
INSERT INTO museum.exposicao (titulo, dias, descricao, diretor_id) VALUES
('Exposição 1', ARRAY['2024-01-01'], 'Descrição 1', 1),
('Exposição 2', ARRAY['2024-02-01'], 'Descrição 2', 2),
('Exposição 3', ARRAY['2024-03-01'], 'Descrição 3', 3),
('Exposição 4', ARRAY['2024-04-01'], 'Descrição 4', 4),
('Exposição 5', ARRAY['2024-05-01'], 'Descrição 5', 5);

-- Inserções para participacaoitemexp (5 participações)
INSERT INTO museum.participacaoitemexp (exposicao_id, item_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Inserções para noticia (5 notícias)
INSERT INTO museum.noticia (titulo, texto, palavraschave, diretor_id) VALUES
('Notícia 1', 'Texto 1', ARRAY['palavra1'], 1),
('Notícia 2', 'Texto 2', ARRAY['palavra2'], 2),
('Notícia 3', 'Texto 3', ARRAY['palavra3'], 3),
('Notícia 4', 'Texto 4', ARRAY['palavra4'], 4),
('Notícia 5', 'Texto 5', ARRAY['palavra5'], 5);

-- Inserções para horariofuncionamento (5 horários)
INSERT INTO museum.horariofuncionamento (horainicio, horafim, diascomerciais, gerente_id) VALUES
('09:00:00', '18:00:00', ARRAY['2024-01-01'], 1),
('08:00:00', '17:00:00', ARRAY['2024-02-01'], 2),
('10:00:00', '19:00:00', ARRAY['2024-03-01'], 3),
('07:00:00', '16:00:00', ARRAY['2024-04-01'], 4),
('08:30:00', '20:00:00', ARRAY['2024-05-01'], 5);

-- Inserções para manutencao (5 manutenções)
INSERT INTO museum.manutencao (numidtecnico, nometecnico, data, descricao, valor, gerente_id, item_id) VALUES
(101, 'Técnico 1', '2024-01-01', 'Descrição 1', 100.00, 1, 1),
(102, 'Técnico 2', '2024-02-01', 'Descrição 2', 200.00, 2, 2),
(103, 'Técnico 3', '2024-03-01', 'Descrição 3', 300.00, 3, 3),
(104, 'Técnico 4', '2024-04-01', 'Descrição 4', 400.00, 4, 4),
(105, 'Técnico 5', '2024-05-01', 'Descrição 5', 500.00, 5, 5);

COMMIT;