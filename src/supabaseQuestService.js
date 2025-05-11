import { supabase } from "./supabaseClient";

/**
 * quests, titles, categories를 join하여 퀘스트 리스트를 가져옵니다.
 * @returns {Promise<{data: any[]|null, error: string|null}>}
 */
export async function fetchQuestsWithRelations() {
  try {
    // 관계형 쿼리: quests에 대해 title, category를 join
    const { data, error } = await supabase.from("quests").select(`
        *
        titles(
          name
        )
        `);
    data.forEach(async (quest) => {
      const { data: questCategorie, error } = await supabase
        .from("quest_categories")
        .select(
          `
        categories(
          name
        )
        `
        )
        .eq("quest_id", quest.id);
      quest.categories = questCategorie.map((category) => category.categories);
    });
    console.log("LOGEE", data);
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

export async function fetchTitles() {
  const { data, error } = await supabase.from("titles").select("*");
  return { data, error };
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  return { data, error };
}
