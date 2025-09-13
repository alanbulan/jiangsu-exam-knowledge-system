package com.jiangsu.exam.controller;

import com.jiangsu.exam.entity.StudyProgress;
import com.jiangsu.exam.entity.User;
import com.jiangsu.exam.entity.KnowledgePoint;
import com.jiangsu.exam.service.StudyProgressService;
import com.jiangsu.exam.service.UserService;
import com.jiangsu.exam.service.KnowledgePointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/study-progress")
@CrossOrigin(origins = "http://localhost:5173")
public class StudyProgressController {
    
    @Autowired
    private StudyProgressService studyProgressService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private KnowledgePointService knowledgePointService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudyProgress>> getProgressByUser(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    List<StudyProgress> progress = studyProgressService.getProgressByUser(user);
                    return ResponseEntity.ok(progress);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}/subject/{subject}")
    public ResponseEntity<List<StudyProgress>> getProgressByUserAndSubject(@PathVariable Long userId, 
                                                                           @PathVariable String subject) {
        return userService.getUserById(userId)
                .map(user -> {
                    List<StudyProgress> progress = studyProgressService.getProgressByUserAndSubject(user, subject);
                    return ResponseEntity.ok(progress);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/update")
    public ResponseEntity<StudyProgress> updateProgress(@RequestBody ProgressUpdateRequest request) {
        User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        KnowledgePoint knowledgePoint = knowledgePointService.getKnowledgePointById(request.getKnowledgePointId())
                .orElseThrow(() -> new RuntimeException("知识点不存在"));
        
        StudyProgress.Status status = StudyProgress.Status.valueOf(request.getStatus().toUpperCase());
        
        StudyProgress progress = studyProgressService.createOrUpdateProgress(
                user, knowledgePoint, status, request.getProgress(), 
                request.getTimeSpent(), request.getNotes());
        
        return ResponseEntity.ok(progress);
    }
    
    @PostMapping("/test-score")
    public ResponseEntity<StudyProgress> addTestScore(@RequestBody TestScoreRequest request) {
        User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        KnowledgePoint knowledgePoint = knowledgePointService.getKnowledgePointById(request.getKnowledgePointId())
                .orElseThrow(() -> new RuntimeException("知识点不存在"));
        
        StudyProgress progress = studyProgressService.addTestScore(user, knowledgePoint, request.getScore());
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    Map<String, Object> statistics = new HashMap<>();
                    statistics.put("totalStudyTime", studyProgressService.getTotalStudyTime(user));
                    statistics.put("averageScore", studyProgressService.getAverageScore(user));
                    statistics.put("completedCount", studyProgressService.getCompletedCount(user));
                    statistics.put("masteredCount", studyProgressService.getMasteredCount(user));
                    return ResponseEntity.ok(statistics);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<StudyProgress>> getProgressByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        return userService.getUserById(userId)
                .map(user -> {
                    List<StudyProgress> progress = studyProgressService.getProgressByDateRange(user, startDate, endDate);
                    return ResponseEntity.ok(progress);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 内部类用于进度更新请求
    public static class ProgressUpdateRequest {
        private Long userId;
        private Long knowledgePointId;
        private String status;
        private Integer progress;
        private Integer timeSpent;
        private String notes;
        
        // Getters and Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getKnowledgePointId() { return knowledgePointId; }
        public void setKnowledgePointId(Long knowledgePointId) { this.knowledgePointId = knowledgePointId; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public Integer getProgress() { return progress; }
        public void setProgress(Integer progress) { this.progress = progress; }
        
        public Integer getTimeSpent() { return timeSpent; }
        public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
    
    // 内部类用于测试成绩请求
    public static class TestScoreRequest {
        private Long userId;
        private Long knowledgePointId;
        private Integer score;
        
        // Getters and Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getKnowledgePointId() { return knowledgePointId; }
        public void setKnowledgePointId(Long knowledgePointId) { this.knowledgePointId = knowledgePointId; }
        
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
    }
}