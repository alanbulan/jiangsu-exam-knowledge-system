package com.jiangsu.exam.config;

import com.jiangsu.exam.entity.KnowledgePoint;
import com.jiangsu.exam.entity.User;
import com.jiangsu.exam.repository.KnowledgePointRepository;
import com.jiangsu.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private KnowledgePointRepository knowledgePointRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化用户数据
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        
        // 初始化知识点数据
        if (knowledgePointRepository.count() == 0) {
            initializeKnowledgePoints();
        }
    }
    
    private void initializeUsers() {
        User user1 = new User();
        user1.setUsername("testuser");
        user1.setPassword(passwordEncoder.encode("123456"));
        user1.setName("测试用户");
        user1.setEmail("test@example.com");
        user1.setPhone("13800138000");
        user1.setTargetExam("江苏省考");
        user1.setExamDate(LocalDate.of(2024, 4, 15));
        user1.setStudyGoal("通过省考，进入公务员队伍");
        user1.setCreatedAt(LocalDateTime.now());
        user1.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user1);
    }
    
    private void initializeKnowledgePoints() {
        // 行政职业能力测验知识点
        List<KnowledgePoint> xingcePoints = Arrays.asList(
            createKnowledgePoint("数量关系基础", "数量关系是行测的重要组成部分，主要考查数学运算和数字推理能力。", 
                "行政职业能力测验", "数量关系", KnowledgePoint.Difficulty.EASY,
                Arrays.asList("数学运算", "数字推理", "基础数学"),
                Arrays.asList("基本数学概念"),
                Arrays.asList("数字推理", "图形推理"),
                Arrays.asList("例题：某班有40名学生，其中男生比女生多8人，问男生有多少人？"),
                Arrays.asList("练习1：计算题", "练习2：应用题")),
                
            createKnowledgePoint("言语理解与表达", "主要测查报考者运用语言文字进行思考和交流、迅速准确地理解和把握文字材料内涵的能力。", 
                "行政职业能力测验", "言语理解", KnowledgePoint.Difficulty.MEDIUM,
                Arrays.asList("阅读理解", "语言文字", "逻辑填空"),
                Arrays.asList("基础语文知识"),
                Arrays.asList("逻辑判断", "资料分析"),
                Arrays.asList("例题：根据文段内容，选择最恰当的标题"),
                Arrays.asList("练习1：阅读理解", "练习2：逻辑填空")),
                
            createKnowledgePoint("判断推理", "主要测查对各种事物关系的分析推理能力，涉及对图形、语词概念、事物关系和文字材料的理解、比较、组合、演绎和归纳等。", 
                "行政职业能力测验", "判断推理", KnowledgePoint.Difficulty.HARD,
                Arrays.asList("逻辑判断", "图形推理", "定义判断", "类比推理"),
                Arrays.asList("基础逻辑知识"),
                Arrays.asList("言语理解", "数量关系"),
                Arrays.asList("例题：根据给定图形的变化规律，选择下一个图形"),
                Arrays.asList("练习1：图形推理", "练习2：逻辑判断"))
        );
        
        // 申论知识点
        List<KnowledgePoint> shenlunPoints = Arrays.asList(
            createKnowledgePoint("申论概述与基本要求", "申论是测查从事机关工作应当具备的基本能力的考试科目。", 
                "申论", "基础理论", KnowledgePoint.Difficulty.EASY,
                Arrays.asList("申论概念", "考试要求", "评分标准"),
                Arrays.asList("基础写作能力"),
                Arrays.asList("归纳概括", "综合分析"),
                Arrays.asList("例题：什么是申论？申论考试的基本要求是什么？"),
                Arrays.asList("练习1：申论概念理解", "练习2：要求分析")),
                
            createKnowledgePoint("归纳概括题", "要求全面把握给定资料的内容，准确理解给定资料的含义，准确提炼事实所包含的观点。", 
                "申论", "题型技巧", KnowledgePoint.Difficulty.MEDIUM,
                Arrays.asList("归纳概括", "要点提取", "材料分析"),
                Arrays.asList("申论基础理论"),
                Arrays.asList("综合分析", "提出对策"),
                Arrays.asList("例题：根据给定资料，概括当前我国环保工作面临的主要问题"),
                Arrays.asList("练习1：问题概括", "练习2：原因归纳"))
        );
        
        // 面试知识点
        List<KnowledgePoint> mianshiPoints = Arrays.asList(
            createKnowledgePoint("结构化面试基础", "结构化面试是根据特定职位的胜任特征要求，遵循固定的程序，采用专门的题库、评价标准和评价方法。", 
                "面试", "面试基础", KnowledgePoint.Difficulty.EASY,
                Arrays.asList("结构化面试", "面试流程", "评价标准"),
                Arrays.asList("基本沟通能力"),
                Arrays.asList("综合分析", "计划组织"),
                Arrays.asList("例题：请简单介绍一下自己"),
                Arrays.asList("练习1：自我介绍", "练习2：面试礼仪")),
                
            createKnowledgePoint("综合分析能力", "主要考查考生对社会现象、政策理解、名言警句等的分析判断能力。", 
                "面试", "能力测评", KnowledgePoint.Difficulty.HARD,
                Arrays.asList("综合分析", "社会现象", "政策理解"),
                Arrays.asList("结构化面试基础"),
                Arrays.asList("应变能力", "人际关系"),
                Arrays.asList("例题：对于'躺平'现象，你怎么看？"),
                Arrays.asList("练习1：社会现象分析", "练习2：政策解读"))
        );
        
        // 保存所有知识点
        knowledgePointRepository.saveAll(xingcePoints);
        knowledgePointRepository.saveAll(shenlunPoints);
        knowledgePointRepository.saveAll(mianshiPoints);
    }
    
    private KnowledgePoint createKnowledgePoint(String title, String content, String subject, 
                                                String category, KnowledgePoint.Difficulty difficulty,
                                                List<String> tags, List<String> prerequisites, 
                                                List<String> relatedTopics, List<String> examples, 
                                                List<String> exercises) {
        KnowledgePoint kp = new KnowledgePoint();
        kp.setTitle(title);
        kp.setContent(content);
        kp.setSubject(subject);
        kp.setCategory(category);
        kp.setDifficulty(difficulty);
        kp.setTags(tags);
        kp.setPrerequisites(prerequisites);
        kp.setRelatedTopics(relatedTopics);
        kp.setExamples(examples);
        kp.setExercises(exercises);
        kp.setCreatedAt(LocalDateTime.now());
        kp.setUpdatedAt(LocalDateTime.now());
        return kp;
    }
}