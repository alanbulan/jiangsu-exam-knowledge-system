package com.jiangsu.exam.controller;

import com.jiangsu.exam.entity.KnowledgePoint;
import com.jiangsu.exam.service.KnowledgePointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/knowledge-points")
@CrossOrigin(origins = "http://localhost:5173")
public class KnowledgePointController {
    
    @Autowired
    private KnowledgePointService knowledgePointService;
    
    @GetMapping
    public ResponseEntity<List<KnowledgePoint>> getAllKnowledgePoints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (page >= 0 && size > 0) {
            Pageable pageable = PageRequest.of(page, size);
            Page<KnowledgePoint> knowledgePointPage = knowledgePointService.getKnowledgePoints(pageable);
            return ResponseEntity.ok(knowledgePointPage.getContent());
        } else {
            List<KnowledgePoint> knowledgePoints = knowledgePointService.getAllKnowledgePoints();
            return ResponseEntity.ok(knowledgePoints);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<KnowledgePoint> getKnowledgePointById(@PathVariable Long id) {
        return knowledgePointService.getKnowledgePointById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<KnowledgePoint>> getKnowledgePointsBySubject(@PathVariable String subject) {
        List<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsBySubject(subject);
        return ResponseEntity.ok(knowledgePoints);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<KnowledgePoint>> getKnowledgePointsByCategory(@PathVariable String category) {
        List<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsByCategory(category);
        return ResponseEntity.ok(knowledgePoints);
    }
    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<KnowledgePoint>> getKnowledgePointsByDifficulty(@PathVariable String difficulty) {
        try {
            KnowledgePoint.Difficulty diff = KnowledgePoint.Difficulty.valueOf(difficulty.toUpperCase());
            List<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsByDifficulty(diff);
            return ResponseEntity.ok(knowledgePoints);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<KnowledgePoint>> searchKnowledgePoints(@RequestParam String keyword) {
        List<KnowledgePoint> knowledgePoints = knowledgePointService.searchKnowledgePoints(keyword);
        return ResponseEntity.ok(knowledgePoints);
    }
    
    @PostMapping("/search/tags")
    public ResponseEntity<List<KnowledgePoint>> getKnowledgePointsByTags(@RequestBody List<String> tags) {
        List<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsByTags(tags);
        return ResponseEntity.ok(knowledgePoints);
    }
    
    @PostMapping
    public ResponseEntity<KnowledgePoint> createKnowledgePoint(@Valid @RequestBody KnowledgePoint knowledgePoint) {
        KnowledgePoint createdKnowledgePoint = knowledgePointService.createKnowledgePoint(knowledgePoint);
        return ResponseEntity.ok(createdKnowledgePoint);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<KnowledgePoint> updateKnowledgePoint(@PathVariable Long id, 
                                                               @Valid @RequestBody KnowledgePoint knowledgePointDetails) {
        try {
            KnowledgePoint updatedKnowledgePoint = knowledgePointService.updateKnowledgePoint(id, knowledgePointDetails);
            return ResponseEntity.ok(updatedKnowledgePoint);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKnowledgePoint(@PathVariable Long id) {
        knowledgePointService.deleteKnowledgePoint(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getAllSubjects() {
        List<String> subjects = knowledgePointService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }
    
    @GetMapping("/subjects/{subject}/categories")
    public ResponseEntity<List<String>> getCategoriesBySubject(@PathVariable String subject) {
        List<String> categories = knowledgePointService.getCategoriesBySubject(subject);
        return ResponseEntity.ok(categories);
    }
}