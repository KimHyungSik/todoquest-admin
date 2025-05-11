import React, { useEffect, useState } from "react";
import {
  fetchQuestsWithRelations,
  fetchCategories,
} from "./supabaseQuestService";

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}
    >
      <button
        style={{
          padding: "6px 16px",
          borderRadius: 16,
          border: "none",
          background: selected === null ? "#1976d2" : "#e0e0e0",
          color: selected === null ? "#fff" : "#333",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => onSelect(null)}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          style={{
            padding: "6px 16px",
            borderRadius: 16,
            border: "none",
            background: selected === cat.id ? "#1976d2" : "#e0e0e0",
            color: selected === cat.id ? "#fff" : "#333",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function QuestList() {
  const [quests, setQuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const [
        { data: questData, error: questError },
        { data: categoryData, error: categoryError },
      ] = await Promise.all([fetchQuestsWithRelations(), fetchCategories()]);
      if (questError || categoryError) {
        setError(questError || categoryError);
        setQuests([]);
        setCategories([]);
      } else {
        setQuests(questData || []);
        setCategories(categoryData || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredQuests = selectedCategory
    ? quests.filter((quest) =>
        Array.isArray(quest.categories)
          ? quest.categories.some(
              (cat) => cat && cat.name && cat.id === selectedCategory
            )
          : false
      )
    : quests;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>퀘스트 목록</h2>
      {loading && <div>퀘스트 목록을 불러오는 중...</div>}
      {error && <div style={{ color: "red" }}>에러 발생: {error}</div>}
      {!loading && !error && (
        <>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          {filteredQuests.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888" }}>
              퀘스트가 없습니다.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {filteredQuests.map((quest) => (
                <li
                  key={quest.id}
                  style={{
                    background: "#fafafa",
                    marginBottom: 12,
                    borderRadius: 8,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: 18 }}>
                    {quest["title"] || quest.titles?.name || "제목 없음"}
                  </span>
                  <span
                    style={{ color: "#1976d2", fontWeight: 500, fontSize: 14 }}
                  >
                    {Array.isArray(quest.categories) &&
                    quest.categories.length > 0
                      ? quest.categories
                          .map((cat) => cat?.name)
                          .filter(Boolean)
                          .join(", ")
                      : "카테고리 없음"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default QuestList;
