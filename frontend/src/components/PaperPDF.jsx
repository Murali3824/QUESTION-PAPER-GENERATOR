import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles using default fonts
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#374151'
  },
  headerSection: {
    marginBottom: 24,
    textAlign: 'center'
  },
  instituteName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  subHeader: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    fontSize: 10,
    color: '#6B7280'
  },
  dot: {
    alignSelf: 'center'
  },
  examInfo: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginBottom: 24,
    borderRadius: 4
  },
  examInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  examInfoText: {
    fontSize: 10,
    color: '#4B5563'
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937'
  },
  marksBadge: {
    backgroundColor: '#EFF6FF',
    padding: '4 8',
    borderRadius: 12,
    fontSize: 10,
    color: '#2563EB'
  },
  table: {
    width: '100%',
    marginBottom: 16
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: '8 12',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  tableHeaderCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#4B5563'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: '8 12'
  },
  questionNo: {
    width: '8%'
  },
  question: {
    width: '67%'
  },
  unit: {
    width: '12%',
    textAlign: 'center'
  },
  btLevel: {
    width: '13%',
    textAlign: 'center'
  }
});

const QuestionSection = ({ title, questions, weightage, badgeStyle }) => {
  if (!questions || questions.length === 0) {
    return (
      <></>
    );
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.marksBadge, badgeStyle]}>{weightage}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.questionNo]}>Q.No</Text>
          <Text style={[styles.tableHeaderCell, styles.question]}>Question</Text>
          <Text style={[styles.tableHeaderCell, styles.unit]}>Unit</Text>
          <Text style={[styles.tableHeaderCell, styles.btLevel]}>BT Level</Text>
        </View>
        {questions.map((q, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.examInfoText, styles.questionNo]}>{q.number}</Text>
            <Text style={[styles.examInfoText, styles.question]}>{q.question}</Text>
            <Text style={[styles.examInfoText, styles.unit]}>{q.unit}</Text>
            <Text style={[styles.examInfoText, styles.btLevel]}>{q.btLevel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const PaperPDF = ({ questions }) => {
  if (!questions || !questions.metadata) return null;
  const { metadata, shortAnswers = [], longAnswers = [] } = questions;

  // Debug log to check what's being received
  // console.log('PDF Metadata:', metadata);
  
  // Ensure time is displayed, with a fallback
  const displayTime = metadata.time || '90 Min';
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.instituteName}>GURU NANAK INSTITUTION OF TECHNOLOGY</Text>
          <Text style={styles.subHeader}>(An UGC Autonomous Institution – Affiliated to JNTUH)</Text>
          <View style={styles.metadataRow}>
            <Text>B.Tech {metadata.year} Year</Text>
            <Text style={styles.dot}>•</Text>
            <Text>{metadata.semester} Semester</Text>
            <Text style={styles.dot}>•</Text>
            <Text>{metadata.examType}</Text>
          </View>
        </View>

        {/* Exam Information */}
        <View style={styles.examInfo}>
          <View style={styles.examInfoRow}>
            <Text style={styles.examInfoText}>
              <Text style={styles.bold}>Time: </Text>
              {displayTime}
            </Text>
            <Text style={styles.examInfoText}>
              <Text style={styles.bold}>Max Marks: </Text>
              {metadata.totalMarks}
            </Text>
          </View>
          <View style={styles.examInfoRow}>
            <Text style={styles.examInfoText}>
              <Text style={styles.bold}>Subject: </Text>
              {metadata.subject}
            </Text>
            <Text style={styles.examInfoText}>
              <Text style={styles.bold}>Branch: </Text>
              {metadata.branch}
            </Text>
            <Text style={styles.examInfoText}>
              <Text style={styles.bold}>Date: </Text>
              {metadata.date || new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Short Answer Questions */}
        <QuestionSection
          title={metadata.shortAnswersHeading || "Part A - Short Answer Questions"}
          questions={shortAnswers}
          weightage={metadata.markWeightage?.shortAnswer}
          badgeStyle={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
        />

        {/* Long Answer Questions */}
        <QuestionSection
          title={metadata.longAnswersHeading || "Part B - Long Answer Questions"}
          questions={longAnswers}
          weightage={metadata.markWeightage?.longAnswer}
          badgeStyle={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}
        />
      </Page>
    </Document>
  );
};

export default PaperPDF;