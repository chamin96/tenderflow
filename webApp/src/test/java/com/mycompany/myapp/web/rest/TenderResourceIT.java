package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.TenderFlowApp;
import com.mycompany.myapp.domain.Tender;
import com.mycompany.myapp.repository.TenderRepository;
import com.mycompany.myapp.service.TenderService;
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
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link TenderResource} REST controller.
 */
@SpringBootTest(classes = TenderFlowApp.class)
public class TenderResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_INFO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_INFO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_INFO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_INFO_CONTENT_TYPE = "image/png";

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private TenderService tenderService;

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

    private MockMvc restTenderMockMvc;

    private Tender tender;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TenderResource tenderResource = new TenderResource(tenderService);
        this.restTenderMockMvc = MockMvcBuilders.standaloneSetup(tenderResource)
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
    public static Tender createEntity(EntityManager em) {
        Tender tender = new Tender()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .info(DEFAULT_INFO)
            .infoContentType(DEFAULT_INFO_CONTENT_TYPE);
        return tender;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tender createUpdatedEntity(EntityManager em) {
        Tender tender = new Tender()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .info(UPDATED_INFO)
            .infoContentType(UPDATED_INFO_CONTENT_TYPE);
        return tender;
    }

    @BeforeEach
    public void initTest() {
        tender = createEntity(em);
    }

    @Test
    @Transactional
    public void createTender() throws Exception {
        int databaseSizeBeforeCreate = tenderRepository.findAll().size();

        // Create the Tender
        restTenderMockMvc.perform(post("/api/tenders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isCreated());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeCreate + 1);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTender.getInfo()).isEqualTo(DEFAULT_INFO);
        assertThat(testTender.getInfoContentType()).isEqualTo(DEFAULT_INFO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createTenderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tenderRepository.findAll().size();

        // Create the Tender with an existing ID
        tender.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTenderMockMvc.perform(post("/api/tenders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = tenderRepository.findAll().size();
        // set the field null
        tender.setTitle(null);

        // Create the Tender, which fails.

        restTenderMockMvc.perform(post("/api/tenders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isBadRequest());

        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTenders() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        // Get all the tenderList
        restTenderMockMvc.perform(get("/api/tenders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tender.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].infoContentType").value(hasItem(DEFAULT_INFO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].info").value(hasItem(Base64Utils.encodeToString(DEFAULT_INFO))));
    }
    
    @Test
    @Transactional
    public void getTender() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        // Get the tender
        restTenderMockMvc.perform(get("/api/tenders/{id}", tender.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tender.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.infoContentType").value(DEFAULT_INFO_CONTENT_TYPE))
            .andExpect(jsonPath("$.info").value(Base64Utils.encodeToString(DEFAULT_INFO)));
    }

    @Test
    @Transactional
    public void getNonExistingTender() throws Exception {
        // Get the tender
        restTenderMockMvc.perform(get("/api/tenders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTender() throws Exception {
        // Initialize the database
        tenderService.save(tender);

        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();

        // Update the tender
        Tender updatedTender = tenderRepository.findById(tender.getId()).get();
        // Disconnect from session so that the updates on updatedTender are not directly saved in db
        em.detach(updatedTender);
        updatedTender
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .info(UPDATED_INFO)
            .infoContentType(UPDATED_INFO_CONTENT_TYPE);

        restTenderMockMvc.perform(put("/api/tenders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTender)))
            .andExpect(status().isOk());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTender.getInfo()).isEqualTo(UPDATED_INFO);
        assertThat(testTender.getInfoContentType()).isEqualTo(UPDATED_INFO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();

        // Create the Tender

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTenderMockMvc.perform(put("/api/tenders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTender() throws Exception {
        // Initialize the database
        tenderService.save(tender);

        int databaseSizeBeforeDelete = tenderRepository.findAll().size();

        // Delete the tender
        restTenderMockMvc.perform(delete("/api/tenders/{id}", tender.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tender.class);
        Tender tender1 = new Tender();
        tender1.setId(1L);
        Tender tender2 = new Tender();
        tender2.setId(tender1.getId());
        assertThat(tender1).isEqualTo(tender2);
        tender2.setId(2L);
        assertThat(tender1).isNotEqualTo(tender2);
        tender1.setId(null);
        assertThat(tender1).isNotEqualTo(tender2);
    }
}
