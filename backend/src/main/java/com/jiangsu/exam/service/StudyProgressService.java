package com.jiangsu.exam.service;

import com.jiangsu.exam.entity.StudyProgress;
import com.jiangsu.exam.entity.User;
import com.jiangsu.exam.entity.KnowledgePoint;
import com.jiangsu.exam.repository.StudyProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudyProgressService {
    
    @Autowired
    private StudyProgressRepository studyProgressRepository;
    
    public List<StudyProgress> getProgressByUser(User user) {
        return studyProgressRepository.findByUser(user);
    }
    
    public List<StudyProgress> getProgressByUserAndSubject(User user, String subject) {
        return studyProgressRepository.findByUserAndSubject(user, subject);
    }
    
    public Optional<StudyProgress> getProgressByUserAndKnowledgePoint(User user, KnowledgePoint knowledgePoint) {
        return studyProgressRepository.findByUserAndKnowledgePoint(user, knowledgePoint);
    }
    
    public StudyProgress createOrUpdateProgress(User user, KnowledgePoint knowledgePoint, 
                                               StudyProgress.Status status, Integer progress, 
                                               Integer timeSpent, String notes) {
        Optional<StudyProgress> existingProgress = studyProgressRepository
                .findByUserAndKnowledgePoint(user, knowledgePoint);
        
        StudyProgress studyProgress;
        if (existingProgress.isPresent()) {
            studyProgress = existingProgress.get();
        } else {
            studyProgress = new StudyProgress(user, knowledgePoint);
        }
        
        studyProgress.setStatus(status);
        studyProgress.setProgress(progress);
        studyProgress.setTimeSpent(studyProgress.getTimeSpent() + timeSpent);
        studyProgress.setLastStudiedAt(LocalDateTime.now());
        if (notes != null) {
            studyProgress.setNotes(notes);
        }
        
        return studyProgressRepository.save(studyProgress);
    }
    
    public StudyProgress addTestScore(User user, KnowledgePoint knowledgePoint, Integer score) {
        StudyProgress progress = studyProgressRepository
                .findByUserAndKnowledgePoint(user, knowledgePoint)
                .orElseThrow(() -> new RuntimeException("学习进度不存在"));
        
        if (progress.getTestScores() == null) {
            progress.setTestScores(List.of(score));
        } else {
            progress.getTestScores().add(score);
        }
        
        return studyProgressRepository.save(progress);
    }
    
    public List<StudyProgress> getProgressByDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        return studyProgressRepository.findByUserAndDateRange(user, startDate, endDate);
    }
    
    public Long getTotalStudyTime(User user) {
        Long totalTime = studyProgressRepository.getTotalStudyTimeByUser(user);
        return totalTime != null ? totalTime : 0L;
    }
    
    public Double getAverageScore(User user) {
        Double avgScore = studyProgressRepository.getAverageScoreByUser(user);
        return avgScore != null ? avgScore : 0.0;
    }
    
    public Long getCompletedCount(User user) {
        return studyProgressRepository.countByUserAndStatus(user, StudyProgress.Status.COMPLETED);
    }
    
    public Long getMasteredCount(User user) {
        return studyProgressRepository.countByUserAndStatus(user, StudyProgress.Status.MASTERED);
    }
}