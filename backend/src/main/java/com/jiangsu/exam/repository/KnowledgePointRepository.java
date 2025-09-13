package com.jiangsu.exam.repository;

import com.jiangsu.exam.entity.KnowledgePoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgePointRepository extends JpaRepository<KnowledgePoint, Long> {
    
    List<KnowledgePoint> findBySubject(String subject);
    
    List<KnowledgePoint> findByCategory(String category);
    
    List<KnowledgePoint> findByDifficulty(KnowledgePoint.Difficulty difficulty);
    
    List<KnowledgePoint> findBySubjectAndCategory(String subject, String category);
    
    @Query("SELECT kp FROM KnowledgePoint kp WHERE kp.title LIKE %:keyword% OR kp.content LIKE %:keyword%")
    List<KnowledgePoint> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT kp FROM KnowledgePoint kp JOIN kp.tags t WHERE t IN :tags")
    List<KnowledgePoint> findByTagsIn(@Param("tags") List<String> tags);
    
    @Query("SELECT DISTINCT kp.subject FROM KnowledgePoint kp")
    List<String> findAllSubjects();
    
    @Query("SELECT DISTINCT kp.category FROM KnowledgePoint kp WHERE kp.subject = :subject")
    List<String> findCategoriesBySubject(@Param("subject") String subject);
}