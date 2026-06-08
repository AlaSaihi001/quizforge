import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { MCQResult } from "@/lib/parsers";

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },

  // Header
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #7c3aed",
    paddingBottom: 16,
  },
  brand: {
    fontSize: 10,
    color: "#7c3aed",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748b",
  },

  // Question
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  questionNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  questionNumberText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  questionText: {
    fontSize: 11,
    color: "#1e293b",
    fontFamily: "Helvetica-Bold",
    flex: 1,
    lineHeight: 1.5,
  },

  // Options
  optionsContainer: {
    marginLeft: 32,
    gap: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 4,
  },
  optionLetter: {
    width: 18,
    height: 18,
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: {
    fontSize: 9,
    color: "#475569",
    fontFamily: "Helvetica-Bold",
  },
  optionText: {
    fontSize: 10,
    color: "#334155",
    flex: 1,
    lineHeight: 1.4,
  },

  // Séparateur
  separator: {
    borderTop: "1px dashed #e2e8f0",
    marginVertical: 24,
  },

  // Section réponses
  answersTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: "1px solid #e2e8f0",
  },
  answerItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 6,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  answerBadge: {
    backgroundColor: "#16a34a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  answerBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  answerQuestion: {
    fontSize: 10,
    color: "#166534",
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  answerExplanation: {
    fontSize: 10,
    color: "#15803d",
    lineHeight: 1.4,
    marginLeft: 0,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 9,
    color: "#94a3b8",
  },
});

const LETTERS = ["A", "B", "C", "D"] as const;

interface MCQPDFProps {
  data: MCQResult;
  title?: string;
}

export function MCQPDF({ data, title = "MCQ Quiz" }: MCQPDFProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={title} author="QuizForge AI" creator="QuizForge AI">
      {/* ── PAGE 1 : QUESTIONS ─────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>QuizForge AI</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {data.questions.length} questions · Generated on {today}
          </Text>
        </View>

        {/* Questions */}
        {data.questions.map((q) => (
          <View key={q.id} style={styles.questionContainer} wrap={false}>
            {/* Numéro + question */}
            <View style={styles.questionHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{q.id}</Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {LETTERS.map((letter) => (
                <View key={letter} style={styles.option}>
                  <View style={styles.optionLetter}>
                    <Text style={styles.optionLetterText}>{letter}</Text>
                  </View>
                  <Text style={styles.optionText}>{q.options[letter]}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
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

      {/* ── PAGE 2 : RÉPONSES ──────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>QuizForge AI</Text>
          <Text style={styles.title}>Answer Key</Text>
          <Text style={styles.subtitle}>{title}</Text>
        </View>

        <Text style={styles.answersTitle}>Correct Answers & Explanations</Text>

        {data.questions.map((q) => (
          <View key={q.id} style={styles.answerItem} wrap={false}>
            <View style={styles.answerHeader}>
              <View style={styles.answerBadge}>
                <Text style={styles.answerBadgeText}>
                  Q{q.id} → {q.correct}
                </Text>
              </View>
              <Text style={styles.answerQuestion}>{q.question}</Text>
            </View>
            <Text style={styles.answerExplanation}>{q.explanation}</Text>
          </View>
        ))}

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
