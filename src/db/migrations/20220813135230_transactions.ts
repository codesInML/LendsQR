import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transaction", (table) => {
    table.increments("id").primary();
    table.string("senderID").notNullable();
    table.string("recipientID").notNullable();
    table.string("amount").notNullable();
    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("account");
}
