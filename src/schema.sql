CREATE DATABASE dindin;

CREATE TABLE usuarios (
	id serial primary key,
  	nome text NOT NULL,
 	email text UNIQUE NOT NULL,
  	senha text NOT NULL
);

CREATE TABLE categorias (
	id serial primary key,
  	descricao text
);

INSERT INTO categorias (descricao)
VALUES 
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');


CREATE TABLE transacoes (
	id serial primary key,
  	descricao text,
  	valor integer NOT NULL,
  	data timestamptz  NOT NULL,
  	categoria_id integer NOT NULL references categorias(id),
  	usuario_id integer NOT NULL references usuarios(id),
  	tipo text NOT NULL
);
