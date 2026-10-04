package com.netpulse.dto;

import java.util.Map;

public class JevDecisionRequest {

    private String model;
    private Object state;
    private Map<String, Object> questions;

    public JevDecisionRequest() {
    }

    public JevDecisionRequest(String model, Object state, Map<String, Object> questions) {
        this.model = model;
        this.state = state;
        this.questions = questions;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Object getState() {
        return state;
    }

    public void setState(Object state) {
        this.state = state;
    }

    public Map<String, Object> getQuestions() {
        return questions;
    }

    public void setQuestions(Map<String, Object> questions) {
        this.questions = questions;
    }
}
