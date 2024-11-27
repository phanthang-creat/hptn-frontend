import { lazy } from 'react'

// Portal
import PortalMainLayout from '~/layouts/portal/main/MainLayout'

import PortalHomePage from '~/pages/portal/home/HomePage'
import PortalIntroductionPage from '~/pages/portal/introduction/IntroductionPage'
import PortalCoursePage from '~/pages/portal/course/CoursePage'
import PortalChessKnowledgePage from '~/pages/portal/chessKnowledge/ChessKnowledgePage'
import PortalNewsPage from '~/pages/portal/news/NewsPage'
import PortalChessShopPage from '~/pages/portal/chessShop/ChessShopPage'
import PortalPrivacyPolicyPage from '~/pages/portal/privacyPolicy/PrivacyPolicyPage'
import PortalTermsOfUsePage from '~/pages/portal/termsOfUse/TermsOfUsePage'

import PortalRecruitmentPage from '~/pages/portal/recruitment/RecruitmentPage'
import PortalRecruitmentDetailPage from '~/pages/portal/recruitment/RecruitmentDetailPage'

import PortalPostCategoryPage from '~/pages/portal/postCategory/PostCategoryPage'
import PortalPostPage from '~/pages/portal/post/PostPage'

import PortalProductDetailPage from '~/pages/portal/chessShop/ProductDetailPage'

// Dashboard
const DashboardMainLayout = lazy(() => import('~/layouts/dashboard/main/MainLayout'))
const DashboardAuthLayout = lazy(() => import('~/layouts/dashboard/auth/AuthLayout'))

const DashboardStatisticPage = lazy(() => import('~/pages/dashboard/statistic/StatisticPage'))
const DashboardLoginPage = lazy(() => import('~/pages/dashboard/login/LoginPage'))
const DashboardPagePage = lazy(() => import('~/pages/dashboard/page/PagePage'))
const DashboardHeaderPage = lazy(() => import('~/pages/dashboard/header/HeaderPage'))
const DashboardFooterPage = lazy(() => import('~/pages/dashboard/footer/FooterPage'))

const DashboardHomePage = lazy(() => import('~/pages/dashboard/home/HomePage'))
const DashboardIntroductionPage = lazy(() => import('~/pages/dashboard/introduction/IntroductionPage'))
const DashboardChessKnowledgePage = lazy(() => import('~/pages/dashboard/chessKnowledge/ChessKnowledgePage'))
const DashboardRecruitmentPage = lazy(() => import('~/pages/dashboard/recruitment/RecruitmentPage'))
const DashboardChessShopPage = lazy(() => import('~/pages/dashboard/chessShop/ChessShopPage'))
const DashboardCoursePage = lazy(() => import('~/pages/dashboard/course/CoursePage'))
const DashboardNewsPage = lazy(() => import('~/pages/dashboard/news/NewsPage'))
const DashboardPrivacyPolicyPage = lazy(() => import('~/pages/dashboard/privacyPolicy/PrivacyPolicyPage'))
const DashboardTermsOfUsePage = lazy(() => import('~/pages/dashboard/termsOfUse/TermsOfUsePage'))

const DashboardPostCategoryPage = lazy(() => import('~/pages/dashboard/postCategory/PostCategoryPage'))
const DashboardPostCategoryCreationPage = lazy(() => import('~/pages/dashboard/postCategory/PostCategoryCreationPage'))
const DashboardPostPage = lazy(() => import('~/pages/dashboard/post/PostPage'))
const DashboardPostCreationPage = lazy(() => import('~/pages/dashboard/post/PostCreationPage'))

const DashboardRecruitmentPostPage = lazy(() => import('~/pages/dashboard/recruitmentPost/RecruitmentPostPage'))
const DashboardRecruitmentPostCreationPage = lazy(
  () => import('~/pages/dashboard/recruitmentPost/RecruitmentPostCreationPage')
)

const DashboardProductCategoryPage = lazy(() => import('~/pages/dashboard/productCategory/ProductCategoryPage'))
const DashboardProductPage = lazy(() => import('~/pages/dashboard/product/ProductPage'))
const DashboardProductCreationPage = lazy(() => import('~/pages/dashboard/product/ProductCreationPage'))

const DashboardApplicationPage = lazy(() => import('~/pages/dashboard/application/ApplicationPage'))
const DashboardGamePage = lazy(() => import('~/pages/dashboard/game/GamePage'))

const routes = [
  // Portal pages
  {
    path: '/',
    layout: PortalMainLayout,
    component: PortalHomePage,
    public: true
  },
  {
    path: '/gioi-thieu',
    layout: PortalMainLayout,
    component: PortalIntroductionPage,
    public: true
  },
  {
    path: '/khoa-hoc',
    layout: PortalMainLayout,
    component: PortalCoursePage,
    public: true
  },
  {
    path: '/kien-thuc-co',
    layout: PortalMainLayout,
    component: PortalChessKnowledgePage,
    public: true
  },
  {
    path: '/tin-tuc',
    layout: PortalMainLayout,
    component: PortalNewsPage,
    public: true
  },
  {
    path: '/tuyen-dung',
    layout: PortalMainLayout,
    component: PortalRecruitmentPage,
    public: true
  },
  {
    path: '/tuyen-dung/:slug',
    layout: PortalMainLayout,
    component: PortalRecruitmentDetailPage,
    public: true
  },
  {
    path: '/chess-shop',
    layout: PortalMainLayout,
    component: PortalChessShopPage,
    public: true
  },
  {
    path: '/san-pham/:slug',
    layout: PortalMainLayout,
    component: PortalProductDetailPage,
    public: true
  },
  {
    path: '/chinh-sach-bao-mat',
    layout: PortalMainLayout,
    component: PortalPrivacyPolicyPage,
    public: true
  },
  {
    path: '/dieu-khoan-su-dung',
    layout: PortalMainLayout,
    component: PortalTermsOfUsePage,
    public: true
  },
  {
    path: '/bai-viet/:slug',
    layout: PortalMainLayout,
    component: PortalPostPage,
    public: true
  },
  {
    path: '/danh-muc-bai-viet/:slug',
    layout: PortalMainLayout,
    component: PortalPostCategoryPage,
    public: true
  },

  // Dashboard pages
  {
    path: '/dashboard',
    layout: DashboardMainLayout,
    component: DashboardStatisticPage,
    public: false
  },
  {
    path: '/dashboard/login',
    layout: DashboardAuthLayout,
    component: DashboardLoginPage,
    public: true
  },
  {
    path: '/dashboard/page',
    layout: DashboardMainLayout,
    component: DashboardPagePage,
    public: false
  },
  {
    path: '/dashboard/header',
    layout: DashboardMainLayout,
    component: DashboardHeaderPage,
    public: false
  },
  {
    path: '/dashboard/footer',
    layout: DashboardMainLayout,
    component: DashboardFooterPage,
    public: false
  },
  {
    path: '/dashboard/home',
    layout: DashboardMainLayout,
    component: DashboardHomePage,
    public: false
  },
  {
    path: '/dashboard/introduction',
    layout: DashboardMainLayout,
    component: DashboardIntroductionPage,
    public: false
  },
  {
    path: '/dashboard/course',
    layout: DashboardMainLayout,
    component: DashboardCoursePage,
    public: false
  },
  {
    path: '/dashboard/chess-knowledge',
    layout: DashboardMainLayout,
    component: DashboardChessKnowledgePage,
    public: false
  },
  {
    path: '/dashboard/news',
    layout: DashboardMainLayout,
    component: DashboardNewsPage,
    public: false
  },
  {
    path: '/dashboard/recruitment',
    layout: DashboardMainLayout,
    component: DashboardRecruitmentPage,
    public: false
  },
  {
    path: '/dashboard/chess-shop',
    layout: DashboardMainLayout,
    component: DashboardChessShopPage,
    public: false
  },
  {
    path: '/dashboard/privacy-policy',
    layout: DashboardMainLayout,
    component: DashboardPrivacyPolicyPage,
    public: false
  },
  {
    path: '/dashboard/terms-of-use',
    layout: DashboardMainLayout,
    component: DashboardTermsOfUsePage,
    public: false
  },
  {
    path: '/dashboard/post-category',
    layout: DashboardMainLayout,
    component: DashboardPostCategoryPage,
    public: false
  },
  {
    path: '/dashboard/post-category/creation',
    layout: DashboardMainLayout,
    component: DashboardPostCategoryCreationPage,
    public: false
  },
  {
    path: '/dashboard/post-category/update/:id',
    layout: DashboardMainLayout,
    component: DashboardPostCategoryCreationPage,
    public: false
  },
  {
    path: '/dashboard/post',
    layout: DashboardMainLayout,
    component: DashboardPostPage,
    public: false
  },
  {
    path: '/dashboard/post/creation',
    layout: DashboardMainLayout,
    component: DashboardPostCreationPage,
    public: false
  },
  {
    path: '/dashboard/post/update/:id',
    layout: DashboardMainLayout,
    component: DashboardPostCreationPage,
    public: false
  },
  {
    path: '/dashboard/recruitment-post',
    layout: DashboardMainLayout,
    component: DashboardRecruitmentPostPage,
    public: false
  },
  {
    path: '/dashboard/recruitment-post/creation',
    layout: DashboardMainLayout,
    component: DashboardRecruitmentPostCreationPage,
    public: false
  },
  {
    path: '/dashboard/recruitment-post/update/:id',
    layout: DashboardMainLayout,
    component: DashboardRecruitmentPostCreationPage,
    public: false
  },
  {
    path: '/dashboard/product-category',
    layout: DashboardMainLayout,
    component: DashboardProductCategoryPage,
    public: false
  },
  {
    path: '/dashboard/product',
    layout: DashboardMainLayout,
    component: DashboardProductPage,
    public: false
  },
  {
    path: '/dashboard/product/creation',
    layout: DashboardMainLayout,
    component: DashboardProductCreationPage,
    public: false
  },
  {
    path: '/dashboard/product/update/:id',
    layout: DashboardMainLayout,
    component: DashboardProductCreationPage,
    public: false
  },
  {
    path: '/dashboard/application',
    layout: DashboardMainLayout,
    component: DashboardApplicationPage,
    public: false
  },
  {
    path: '/dashboard/game',
    layout: DashboardMainLayout,
    component: DashboardGamePage,
    public: false
  }
]

export default routes
