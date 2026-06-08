import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { SummaryResult } from "@/lib/parsers";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 28,
    borderBottom: "2px solid #7c3aed",
    paddingBottom: 16,
  },
  brand: {
    fontSize: 9,
    color: "#7c3aed",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: "#94a3b8",
  },

  // Overview
  overviewBox: {
    backgroundColor: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  overviewLabel: {
    fontSize: 9,
    color: "#7c3aed",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  overviewText: {
    fontSize: 11,
    color: "#1e293b",
    lineHeight: 1.6,
  },

  // Key points
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 4,
  },
  keyPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 6,
  },
  keyPointNumber: {
    width: 22,
    height: 22,
    backgroundColor: "#16a34a",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  keyPointNumberText: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  keyPointContent: {
    flex: 1,
  },
  keyPointTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
    marginBottom: 3,
  },
  keyPointDetail: {
    fontSize: 10,
    color: "#15803d",
    lineHeight: 1.4,
  },

  // Terms
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  term: {
    width: "47%",
    padding: 10,
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 6,
    marginBottom: 8,
  },
  termWord: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
    marginBottom: 3,
  },
  termDef: {
    fontSize: 9,
    color: "#1e40af",
    lineHeight: 1.4,
  },

  // Conclusion
  conclusionBox: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  conclusionLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  conclusionText: {
    fontSize: 11,
    color: "#f1f5f9",
    lineHeight: 1.5,
  },

  separator: {
    borderTop: "1px solid #e2e8f0",
    marginVertical: 20,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: "#94a3b8" },
  pageNumber: { fontSize: 8, color: "#94a3b8" },
});

interface SummaryPDFProps {
  data: SummaryResult;
}

export function SummaryPDF({ data }: SummaryPDFProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={data.title} author="QuizForge AI">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>QuizForge AI — Summary</Text>
          <Text style={styles.mainTitle}>{data.title}</Text>
          <Text style={styles.date}>Generated on {today}</Text>
        </View>

        {/* Overview */}
        <View style={styles.overviewBox}>
          <Text style={styles.overviewLabel}>Overview</Text>
          <Text style={styles.overviewText}>{data.overview}</Text>
        </View>

        {/* Key Points */}
        <Text style={styles.sectionTitle}>
          Key Points ({data.key_points.length})
        </Text>
        {data.key_points.map((kp) => (
          <View key={kp.id} style={styles.keyPoint} wrap={false}>
            <View style={styles.keyPointNumber}>
              <Text style={styles.keyPointNumberText}>{kp.id}</Text>
            </View>
            <View style={styles.keyPointContent}>
              <Text style={styles.keyPointTitle}>{kp.point}</Text>
              <Text style={styles.keyPointDetail}>{kp.detail}</Text>
            </View>
          </View>
        ))}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Important Terms */}
        <Text style={styles.sectionTitle}>
          Important Terms ({data.important_terms.length})
        </Text>
        <View style={styles.termsGrid}>
          {data.important_terms.map((term, i) => (
            <View key={i} style={styles.term}>
              <Text style={styles.termWord}>{term.term}</Text>
              <Text style={styles.termDef}>{term.definition}</Text>
            </View>
          ))}
        </View>

        {/* Conclusion */}
        <View style={styles.conclusionBox}>
          <Text style={styles.conclusionLabel}>Conclusion</Text>
          <Text style={styles.conclusionText}>{data.conclusion}</Text>
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
