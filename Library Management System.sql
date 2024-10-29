CREATE TABLE "loans" (
  "loans_id" integer PRIMARY KEY,
  "borrower_id" integer,
  "book_id" integer,
  "loan_date" timestamp DEFAULT 'now()',
  "due_date" timestamp NOT NULL,
  "return_date" timestamp,
  "loan_status" varchar DEFAULT 'On_loan'
);

CREATE TABLE "borrowers" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "registered_date" timestamp DEFAULT 'now()'
);

CREATE TABLE "books" (
  "id" integer PRIMARY KEY,
  "title" varchar NOT NULL,
  "author" varchar NOT NULL,
  "ISBN" varchar,
  "available_quantity" integer,
  "shelf_location" varchar
);

CREATE INDEX "borrower_book" ON "loans" ("borrower_id", "book_id");

ALTER TABLE "loans" ADD FOREIGN KEY ("book_id") REFERENCES "books" ("id");

ALTER TABLE "loans" ADD FOREIGN KEY ("borrower_id") REFERENCES "borrowers" ("id");
