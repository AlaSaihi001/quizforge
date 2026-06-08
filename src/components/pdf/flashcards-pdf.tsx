import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { FlashcardsResult } from "@/lib/parsers";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #7c3aed",
    paddingBottom: 14,
  },
  brand: {
    fontSize: 9,
    color: "#7c3aed",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
  },

  // Grille de 2 colonnes
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Carte flashcard
  card: {
    width: "47%",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  cardFront: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderBottom: "1px solid #e2e8f0",
    minHeight: 70,
  },
  cardFrontLabel: {
    fontSize: 8,
    color: "#7c3aed",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardFrontText: {
    fontSize: 10,
    color: "#1e293b",
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.4,
  },
  cardBack: {
    backgroundColor: "#ffffff",
    padding: 12,
    minHeight: 60,
  },
  cardBackLabel: {
    fontSize: 8,
    color: "#16a34a",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardBackText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.4,
  },
  hint: {
    marginTop: 6,
    fontSize: 9,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  cardNumber: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 9,
    color: "#cbd5e1",
    fontFamily: "Helvetica-Bold",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: "#94a3b8" },
  pageNumber: { fontSize: 8, color: "#94a3b8" },
});

interface FlashcardsPDFProps {
  data: FlashcardsResult;
  title?: string;
}

export function FlashcardsPDF({
  data,
  title = "Flashcards",
}: FlashcardsPDFProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={title} author="QuizForge AI">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>QuizForge AI</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {data.flashcards.length} flashcards · {today}
          </Text>
        </View>

        {/* Grille 2 colonnes */}
        <View style={styles.grid}>
          {data.flashcards.map((card) => (
            <View key={card.id} style={styles.card} wrap={false}>
              {/* Front — Question */}
              <View style={styles.cardFront}>
                <Text style={styles.cardFrontLabel}>Question</Text>
                <Text style={styles.cardFrontText}>{card.front}</Text>
                {card.hint && <Text style={styles.hint}>💡 {card.hint}</Text>}
              </View>

              {/* Back — Réponse */}
              <View style={styles.cardBack}>
                <Text style={styles.cardBackLabel}>Answer</Text>
                <Text style={styles.cardBackText}>{card.back}</Text>
              </View>

              {/* Numéro de carte */}
              <Text style={styles.cardNumber}>#{card.id}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            QuizForge AI · quizforge.vercel.app
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
