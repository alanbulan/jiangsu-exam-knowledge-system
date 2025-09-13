package com.jiangsu.exam.service;

import com.jiangsu.exam.entity.KnowledgePoint;
import com.jiangsu.exam.repository.KnowledgePointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class KnowledgePointService {
    
    @Autowired
    private KnowledgePointRepository knowledgePointRepository;
    
    public List<KnowledgePoint> getAllKnowledgePoints() {
        return knowledgePointRepository.findAll();
    }
    
    public Page<KnowledgePoint> getKnowledgePoints(Pageable pageable) {
        return knowledgePointRepository.findAll(pageable);
    }
    
    public Optional<KnowledgePoint> getKnowledgePointById(Long id) {
        return knowledgePointRepository.findById(id);
    }
    
    public List<KnowledgePoint> getKnowledgePointsBySubject(String subject) {
        return knowledgePointRepository.findBySubject(subject);
    }
    
    public List<KnowledgePoint> getKnowledgePointsByCategory(String category) {
        return knowledgePointRepository.findByCategory(category);
    }
    
    public List<KnowledgePoint> getKnowledgePointsByDifficulty(KnowledgePoint.Difficulty difficulty) {
        return knowledgePointRepository.findByDifficulty(difficulty);
    }
    
    public List<KnowledgePoint> searchKnowledgePoints(String keyword) {
        return knowledgePointRepository.findByKeyword(keyword);
    }
    
    public List<KnowledgePoint> getKnowledgePointsByTags(List<String> tags) {
        return knowledgePointRepository.findByTagsIn(tags);
    }
    
    public KnowledgePoint createKnowledgePoint(KnowledgePoint knowledgePoint) {
        return knowledgePointRepository.save(knowledgePoint);
    }
    
    public KnowledgePoint updateKnowledgePoint(Long id, KnowledgePoint knowledgePointDetails) {
        return knowledgePointRepository.findById(id)
                .map(knowledgePoint -> {
                    knowledgePoint.setTitle(knowledgePointDetails.getTitle());
                    knowledgePoint.setContent(knowledgePointDetails.getContent());
                    knowledgePoint.setSubject(knowledgePointDetails.getSubject());
                    knowledgePoint.setCategory(knowledgePointDetails.getCategory());
                    knowledgePoint.setDifficulty(knowledgePointDetails.getDifficulty());
                    knowledgePoint.setTags(knowledgePointDetails.getTags());
                    knowledgePoint.setPrerequisites(knowledgePointDetails.getPrerequisites());
                    knowledgePoint.setRelatedTopics(knowledgePointDetails.getRelatedTopics());
                    knowledgePoint.setExamples(knowledgePointDetails.getExamples());
                    knowledgePoint.setExercises(knowledgePointDetails.getExercises());
                    return knowledgePointRepository.save(knowledgePoint);
                })
                .orElseThrow(() -> new RuntimeException("知识点不存在，ID: " + id));
    }
    
    public void deleteKnowledgePoint(Long id) {
        knowledgePointRepository.deleteById(id);
    }
    
    public List<String> getAllSubjects() {
        return knowledgePointRepository.findAllSubjects();
    }
    
    public List<String> getCategoriesBySubject(String subject) {
        return knowledgePointRepository.findCategoriesBySubject(subject);
    }
}