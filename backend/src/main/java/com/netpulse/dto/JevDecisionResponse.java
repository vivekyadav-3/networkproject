package com.netpulse.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JevDecisionResponse {

    private Map<String, JevAnswer> answers;

    public JevDecisionResponse() {
    }

    public JevDecisionResponse(Map<String, JevAnswer> answers) {
        this.answers = answers;
    }

    public Map<String, JevAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, JevAnswer> answers) {
        this.answers = answers;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JevAnswer {
        private Object value;
        private Double confidence;
        private String reasoning;
        private Map<String, Double> probabilities;

        public JevAnswer() {
        }

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public String getReasoning() {
            return reasoning;
        }

        public void setReasoning(String reasoning) {
            this.reasoning = reasoning;
        }

        public Map<String, Double> getProbabilities() {
            return probabilities;
        }

        public void setProbabilities(Map<String, Double> probabilities) {
            this.probabilities = probabilities;
        }
    }
}
