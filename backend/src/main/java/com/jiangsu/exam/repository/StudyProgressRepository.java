package com.jiangsu.exam.repository;

import com.jiangsu.exam.entity.StudyProgress;
import com.jiangsu.exam.entity.User;
import com.jiangsu.exam.entity.KnowledgePoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyProgressRepository extends JpaRepository<StudyProgress, Long> {
    
    List<StudyProgress> findByUser(User user);
    
    List<StudyProgress> findByUserAndStatus(User user, StudyProgress.Status status);
    
    Optional<StudyProgress> findByUserAndKnowledgePoint(User user, KnowledgePoint knowledgePoint);
    
    @Query("SELECT sp FROM StudyProgress sp WHERE sp.user = :user AND sp.knowledgePoint.subject = :subject")
    List<StudyProgress> findByUserAndSubject(@Param("user") User user, @Param("subject") String subject);
    
    @Query("SELECT sp FROM StudyProgress sp WHERE sp.user = :user AND sp.lastStudiedAt BETWEEN :startDate AND :endDate")
    List<StudyProgress> findByUserAndDateRange(@Param("user") User user, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(sp) FROM StudyProgress sp WHERE sp.user = :user AND sp.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") StudyProgress.Status status);
    
    @Query("SELECT SUM(sp.timeSpent) FROM StudyProgress sp WHERE sp.user = :user")
    Long getTotalStudyTimeByUser(@Param("user") User user);
    
    @Query("SELECT AVG(score) FROM StudyProgress sp JOIN sp.testScores score WHERE sp.user = :user")
    Double getAverageScoreByUser(@Param("user") User user);
}