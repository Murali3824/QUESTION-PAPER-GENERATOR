import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  questionNumber: {
    width: 20,
    fontWeight: 'bold',
  },
  questionContent: {
    flex: 1,
  },
  metadata: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'right',
    color: '#666',
  },
});

// Helper function to strip HTML tags
const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, '');
};

const PaperPDF = ({ questions }) => {
  if (!questions) return null;
  
  const { metadata, shortAnswers, longAnswers } = questions;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{metadata.subject}</Text>
          <Text style={styles.subtitle}>
            {metadata.branch} - {metadata.regulation} - Year {metadata.year}
          </Text>
          <Text style={styles.subtitle}>
            Semester {metadata.semester} - Unit {metadata.unit}
          </Text>
        </View>
        
        {/* Short Answer Questions */}
        {shortAnswers && shortAnswers.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Part A - Short Answer Questions</Text>
            {shortAnswers.map((q) => (
              <View key={q.number} style={styles.questionContainer}>
                <View style={styles.questionRow}>
                  <Text style={styles.questionNumber}>{q.number}.</Text>
                  <Text style={styles.questionContent}>{stripHtml(q.question)}</Text>
                </View>
                <Text style={styles.metadata}>
                  BT Level: {q.btLevel} | Unit: {q.unit} | Marks: {q.marks || 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Long Answer Questions */}
        {longAnswers && longAnswers.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Part B - Long Answer Questions</Text>
            {longAnswers.map((q) => (
              <View key={q.number} style={styles.questionContainer}>
                <View style={styles.questionRow}>
                  <Text style={styles.questionNumber}>{q.number}.</Text>
                  <Text style={styles.questionContent}>{stripHtml(q.question)}</Text>
                </View>
                <Text style={styles.metadata}>
                  BT Level: {q.btLevel} | Unit: {q.unit} | Marks: {q.marks || 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.footer}>
          Total Questions: {metadata.totalQuestions}
        </Text>
      </Page>
    </Document>
  );
};

export default PaperPDF;