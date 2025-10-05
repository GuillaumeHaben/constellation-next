"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ClubsList() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/clubs") // replace with your Strapi URL
      .then((res) => {
        // Strapi v4 wraps data in res.data.data
        setClubs(res.data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul className="list-disc pl-5">
      {clubs.map((club) => (
        <li key={club.id}>
          {club.name ?? "Unnamed club"}
        </li>
      ))}
    </ul>
  );
}
