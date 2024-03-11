import postgresClient from "../config/db.js";

const addBook = async (req, res) => {
  console.log(req.userId);
  try {
    const {
      title,
      author,
      genre,
      publisher,
      publicationYear,
      condition,
      description,
      imageUrl,
      isActive,
    } = req.body;

    const values = [
      title,
      author,
      genre,
      publisher,
      publicationYear,
      condition,
      req.userId,
      description,
      imageUrl,
      isActive,
    ];

    const add = await postgresClient.query(
      "INSERT INTO Books (title,author,genre,publisher,publicationyear,condition,ownerid,description,imageurl,isactive) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      values
    );

    res.status(200).json({ message: "New book has been successfully added." });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default addBook;
