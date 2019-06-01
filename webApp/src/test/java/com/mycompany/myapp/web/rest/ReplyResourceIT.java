package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.TenderFlowApp;
import com.mycompany.myapp.domain.Reply;
import com.mycompany.myapp.repository.ReplyRepository;
import com.mycompany.myapp.service.ReplyService;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link ReplyResource} REST controller.
 */
@SpringBootTest(classes = TenderFlowApp.class)
public class ReplyResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_RESPONSE_INFO = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSE_INFO = "BBBBBBBBBB";

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private ReplyService replyService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restReplyMockMvc;

    private Reply reply;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ReplyResource replyResource = new ReplyResource(replyService);
        this.restReplyMockMvc = MockMvcBuilders.standaloneSetup(replyResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reply createEntity(EntityManager em) {
        Reply reply = new Reply()
            .date(DEFAULT_DATE)
            .responseInfo(DEFAULT_RESPONSE_INFO);
        return reply;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reply createUpdatedEntity(EntityManager em) {
        Reply reply = new Reply()
            .date(UPDATED_DATE)
            .responseInfo(UPDATED_RESPONSE_INFO);
        return reply;
    }

    @BeforeEach
    public void initTest() {
        reply = createEntity(em);
    }

    @Test
    @Transactional
    public void createReply() throws Exception {
        int databaseSizeBeforeCreate = replyRepository.findAll().size();

        // Create the Reply
        restReplyMockMvc.perform(post("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reply)))
            .andExpect(status().isCreated());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeCreate + 1);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testReply.getResponseInfo()).isEqualTo(DEFAULT_RESPONSE_INFO);
    }

    @Test
    @Transactional
    public void createReplyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = replyRepository.findAll().size();

        // Create the Reply with an existing ID
        reply.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReplyMockMvc.perform(post("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reply)))
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = replyRepository.findAll().size();
        // set the field null
        reply.setDate(null);

        // Create the Reply, which fails.

        restReplyMockMvc.perform(post("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reply)))
            .andExpect(status().isBadRequest());

        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkResponseInfoIsRequired() throws Exception {
        int databaseSizeBeforeTest = replyRepository.findAll().size();
        // set the field null
        reply.setResponseInfo(null);

        // Create the Reply, which fails.

        restReplyMockMvc.perform(post("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reply)))
            .andExpect(status().isBadRequest());

        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllReplies() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        // Get all the replyList
        restReplyMockMvc.perform(get("/api/replies?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reply.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].responseInfo").value(hasItem(DEFAULT_RESPONSE_INFO.toString())));
    }
    
    @Test
    @Transactional
    public void getReply() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        // Get the reply
        restReplyMockMvc.perform(get("/api/replies/{id}", reply.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(reply.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.responseInfo").value(DEFAULT_RESPONSE_INFO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingReply() throws Exception {
        // Get the reply
        restReplyMockMvc.perform(get("/api/replies/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReply() throws Exception {
        // Initialize the database
        replyService.save(reply);

        int databaseSizeBeforeUpdate = replyRepository.findAll().size();

        // Update the reply
        Reply updatedReply = replyRepository.findById(reply.getId()).get();
        // Disconnect from session so that the updates on updatedReply are not directly saved in db
        em.detach(updatedReply);
        updatedReply
            .date(UPDATED_DATE)
            .responseInfo(UPDATED_RESPONSE_INFO);

        restReplyMockMvc.perform(put("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedReply)))
            .andExpect(status().isOk());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testReply.getResponseInfo()).isEqualTo(UPDATED_RESPONSE_INFO);
    }

    @Test
    @Transactional
    public void updateNonExistingReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();

        // Create the Reply

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReplyMockMvc.perform(put("/api/replies")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reply)))
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteReply() throws Exception {
        // Initialize the database
        replyService.save(reply);

        int databaseSizeBeforeDelete = replyRepository.findAll().size();

        // Delete the reply
        restReplyMockMvc.perform(delete("/api/replies/{id}", reply.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reply.class);
        Reply reply1 = new Reply();
        reply1.setId(1L);
        Reply reply2 = new Reply();
        reply2.setId(reply1.getId());
        assertThat(reply1).isEqualTo(reply2);
        reply2.setId(2L);
        assertThat(reply1).isNotEqualTo(reply2);
        reply1.setId(null);
        assertThat(reply1).isNotEqualTo(reply2);
    }
}
