package com.jiangsu.exam.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "study_progress")
public class StudyProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knowledge_point_id", nullable = false)
    private KnowledgePoint knowledgePoint;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(nullable = false)
    private Integer progress = 0; // 0-100
    
    @Column(name = "time_spent")
    private Integer timeSpent = 0; // minutes
    
    @Column(name = "last_studied_at")
    private LocalDateTime lastStudiedAt;
    
    @ElementCollection
    @CollectionTable(name = "study_test_scores", joinColumns = @JoinColumn(name = "study_progress_id"))
    @Column(name = "score")
    private List<Integer> testScores;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Status {
        NOT_STARTED, IN_PROGRESS, COMPLETED, MASTERED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public StudyProgress() {}
    
    public StudyProgress(User user, KnowledgePoint knowledgePoint) {
        this.user = user;
        this.knowledgePoint = knowledgePoint;
        this.status = Status.NOT_STARTED;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public KnowledgePoint getKnowledgePoint() { return knowledgePoint; }
    public void setKnowledgePoint(KnowledgePoint knowledgePoint) { this.knowledgePoint = knowledgePoint; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    
    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }
    
    public LocalDateTime getLastStudiedAt() { return lastStudiedAt; }
    public void setLastStudiedAt(LocalDateTime lastStudiedAt) { this.lastStudiedAt = lastStudiedAt; }
    
    public List<Integer> getTestScores() { return testScores; }
    public void setTestScores(List<Integer> testScores) { this.testScores = testScores; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}