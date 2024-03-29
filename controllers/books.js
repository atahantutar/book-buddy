import postgresClient from "../config/db.js";

export const getAllBooks = async (req, res) => {
  try {
    const getBooks = postgresClient.query("SELECT * FROM Books ");
    res.status(200).json({ Books: (await getBooks).rows });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
export const getUserBooks = async (req, res) => {
  try {
    const ownerId = req.userId;
    const getBooks = postgresClient.query(
      "SELECT * FROM Books WHERE ownerid=$1",
      [ownerId]
    );
    res.status(200).json({ Books: (await getBooks).rows });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
export const addBook = async (req, res) => {
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
export const deleteBook = async (req, res) => {
  try {
    const bookID = req.params.bookId;
    const ownerId = req.userId;
    const checkBook = postgresClient.query(
      "SELECT * FROM books WHERE bookid=$1 AND ownerid=$2",
      [bookID, ownerId]
    );
    if ((await checkBook).rowCount == 0) {
      res.status(404).json({ message: "Book not found." });
    } else {
      const deletedBook = postgresClient.query(
        "DELETE FROM books WHERE bookid=$1 RETURNING *",
        [bookID]
      );

      res.status(200).json({
        deletedBook: (await deletedBook).rows,
      });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
export const swapOffer = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.body.bookId;
    const ownerId = req.body.ownerId;
    const date = new Date().toISOString();

    const queryOffers =
      " UPDATE users SET swap_offers = swap_offers || ARRAY[ARRAY[$1, $2,$3,$4 ]] WHERE id = $5";

    const queryRequest =
      " UPDATE users SET swap_requests = swap_requests || ARRAY[ARRAY[$1, $2,$3,$4 ]] WHERE id = $5";

    await postgresClient.query(queryOffers, [
      userId,
      bookId,
      "0",
      date,
      ownerId,
    ]);
    await postgresClient.query(queryRequest, [
      ownerId,
      bookId,
      "0",
      date,
      userId,
    ]);
    res.status(200).json({ message: "Your swap offer has been delivered." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const swapOffers = async (req, res) => {
  try {
    const userId = req.userId;

    const query = "SELECT swap_offers FROM users WHERE id=$1";

    const swapOffers = await postgresClient.query(query, [userId]);

    res.status(200).json({ swapOffers: swapOffers.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const swapRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const query = "SELECT swap_requests FROM users WHERE id=$1";

    const swapOffers = await postgresClient.query(query, [userId]);

    res.status(200).json({ swapOffers: swapOffers.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
