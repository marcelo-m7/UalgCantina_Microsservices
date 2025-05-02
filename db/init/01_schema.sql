CREATE TABLE Alergenos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Pratos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  designacao VARCHAR(255) NOT NULL
);

-- Relação N-N prato × alergeno
CREATE TABLE PratoAlergeno (
  prato_id INT NOT NULL,
  alergeno_id INT NOT NULL,
  PRIMARY KEY (prato_id, alergeno_id),
  FOREIGN KEY (prato_id)   REFERENCES Pratos(id)     ON DELETE CASCADE,
  FOREIGN KEY (alergeno_id) REFERENCES Alergenos(id) ON DELETE CASCADE
);

CREATE TABLE Ementas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE NOT NULL
);

-- Cada ementa pode listar vários pratos
CREATE TABLE EmentaPrato (
  ementa_id INT NOT NULL,
  prato_id  INT NOT NULL,
  PRIMARY KEY (ementa_id, prato_id),
  FOREIGN KEY (ementa_id) REFERENCES Ementas(id) ON DELETE CASCADE,
  FOREIGN KEY (prato_id)  REFERENCES Pratos(id)  ON DELETE CASCADE
);
