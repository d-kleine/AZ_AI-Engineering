# Azure Storage Explorer

- You first need to log into the Azure CLI with `az login`
- Create the storages there and upload the files there (the _csv_ file to a Table, make sure to use delimiter `,`; The folder with the PDF files to a Blob Container).

# AI Search

- Import the data sources and use "extract key phrases" as enrichments
- For _courses_, make sure to add these lines as they appear in the base file but won#t be recognized by the automatic indexer:
  - `level`
  - `product`
  - `title`
- Also make sure for _courses_ to set `duration` to `Edm.String` as some values in the tables are string like `12 months`.
- Enable CORS both bot data sources
