package com.jiangsu.exam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "knowledge_points")
public class KnowledgePoint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "标题不能为空")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @NotBlank(message = "科目不能为空")
    @Column(nullable = false)
    private String subject; // xingce, shenlun, mianshi
    
    @NotBlank(message = "分类不能为空")
    @Column(nullable = false)
    private String category;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "难度不能为空")
    private Difficulty difficulty;
    
    @ElementCollection
    @CollectionTable(name = "knowledge_point_tags", joinColumns = @JoinColumn(name = "knowledge_point_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @ElementCollection
    @CollectionTable(name = "knowledge_point_prerequisites", joinColumns = @JoinColumn(name = "knowledge_point_id"))
    @Column(name = "prerequisite_id")
    private List<String> prerequisites;
    
    @ElementCollection
    @CollectionTable(name = "knowledge_point_related_topics", joinColumns = @JoinColumn(name = "knowledge_point_id"))
    @Column(name = "related_topic_id")
    private List<String> relatedTopics;
    
    @ElementCollection
    @CollectionTable(name = "knowledge_point_examples", joinColumns = @JoinColumn(name = "knowledge_point_id"))
    @Column(name = "example", columnDefinition = "TEXT")
    private List<String> examples;
    
    @ElementCollection
    @CollectionTable(name = "knowledge_point_exercises", joinColumns = @JoinColumn(name = "knowledge_point_id"))
    @Column(name = "exercise", columnDefinition = "TEXT")
    private List<String> exercises;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Difficulty {
        EASY, MEDIUM, HARD
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
    public KnowledgePoint() {}
    
    public KnowledgePoint(String title, String content, String subject, String category, Difficulty difficulty) {
        this.title = title;
        this.content = content;
        this.subject = subject;
        this.category = category;
        this.difficulty = difficulty;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public List<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; }
    
    public List<String> getRelatedTopics() { return relatedTopics; }
    public void setRelatedTopics(List<String> relatedTopics) { this.relatedTopics = relatedTopics; }
    
    public List<String> getExamples() { return examples; }
    public void setExamples(List<String> examples) { this.examples = examples; }
    
    public List<String> getExercises() { return exercises; }
    public void setExercises(List<String> exercises) { this.exercises = exercises; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}