import fs from 'node:fs';
import path from 'node:path';

const workspace = process.cwd();
const outputPath = path.join(workspace, 'Victor_Project_Report.docx');

const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function textRuns(text, preserve = false) {
  const attr = preserve ? ' xml:space="preserve"' : '';
  return `<w:r><w:t${attr}>${esc(text)}</w:t></w:r>`;
}

function paragraph(text, style = 'Normal') {
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr>${textRuns(text)}</w:p>`;
}

function bullet(text) {
  return `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>${textRuns(text)}</w:p>`;
}

function codeBlock(code) {
  return code
    .trim()
    .split('\n')
    .map((line) => `<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr>${textRuns(line, true)}</w:p>`)
    .join('');
}

function cell(content) {
  return `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>${content}</w:tc>`;
}

function table(headers, rows) {
  const headerRow = `<w:tr>${headers.map((h) => cell(paragraph(h, 'TableHeader'))).join('')}</w:tr>`;
  const bodyRows = rows
    .map((row) => `<w:tr>${row.map((item) => cell(paragraph(item, 'TableText'))).join('')}</w:tr>`)
    .join('');
  return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:firstRow="1" w:noHBand="0" w:noVBand="1"/></w:tblPr>${headerRow}${bodyRows}</w:tbl>`;
}

function heading(text, level = 1) {
  return paragraph(text, level === 1 ? 'Heading1' : level === 2 ? 'Heading2' : 'Heading3');
}

const parts = [];

parts.push(paragraph('BÁO CÁO KỸ THUẬT DỰ ÁN VICTOR', 'Title'));
parts.push(paragraph('Tổng hợp kiến thức, công cụ, mã nguồn, function và luồng hoạt động', 'Subtitle'));
parts.push(paragraph('Tài liệu này được biên tập để có thể đọc và trình bày trực tiếp trong báo cáo. Nội dung tập trung giải thích phần nào là React, phần nào là JavaScript backend, các function quan trọng hoạt động ra sao và dữ liệu đi qua hệ thống như thế nào.'));

parts.push(heading('1. Tổng quan dự án'));
parts.push(paragraph('Victor là một ứng dụng web full-stack cho thương hiệu cầu lông VICTOR. Hệ thống cho phép người dùng xem catalogue sản phẩm, lọc sản phẩm, xem chi tiết, so sánh sản phẩm, tìm kiếm, xem thông tin vận động viên Team Victor, đăng nhập/đăng ký và hỏi trợ lý AI Victor Cortex để được tư vấn sản phẩm.'));
parts.push(paragraph('Dự án gồm hai phần chính: frontend React chạy trên trình duyệt và backend Express chạy trên Node.js. Frontend không truy cập database trực tiếp mà gọi các endpoint /api. Backend xử lý xác thực, phân quyền, truy vấn MongoDB và gọi dịch vụ AI.'));
parts.push(bullet('Frontend: React 19, Vite, React Router DOM, Clerk React, CSS component.'));
parts.push(bullet('Backend: Express 5, Mongoose, Clerk Express, Zod, Express Rate Limit.'));
parts.push(bullet('Database: MongoDB, gồm Product, Athlete và ChatLog.'));
parts.push(bullet('AI: Groq API theo chuẩn OpenAI-compatible chat completions, trả dữ liệu dạng streaming.'));
parts.push(bullet('Triển khai: Vite build frontend ra thư mục dist; backend có entry serverless cho Vercel.'));

parts.push(heading('2. Phân loại file: React, JavaScript backend và cấu hình'));
parts.push(heading('2.1. React frontend', 2));
parts.push(table(['File', 'Loại', 'Vai trò'], [
  ['src/main.jsx', 'React entry', 'Khởi tạo React app, gắn BrowserRouter, ClerkProvider, AuthProvider và App.'],
  ['src/App.jsx', 'React root component', 'Định nghĩa route, state so sánh, search modal và logic chuyển trang chi tiết.'],
  ['src/context/AuthContext.jsx', 'React context', 'Chuẩn hóa user từ Clerk, cung cấp isAdmin, logout và getToken.'],
  ['src/components/Header.jsx', 'React component', 'Thanh điều hướng, menu user, menu mobile, nút compare, search và admin link.'],
  ['src/components/ProductCatalog.jsx', 'React component', 'Fetch danh sách sản phẩm, lọc theo loại, giá, series, màu, tốc độ và render product grid.'],
  ['src/components/ProductDetail.jsx', 'React component', 'Hiển thị chi tiết sản phẩm, ảnh, thông số, tab và nút compare.'],
  ['src/components/CompareTool.jsx', 'React component', 'Modal so sánh tối đa 3 sản phẩm, hiển thị thông số theo từng loại sản phẩm.'],
  ['src/components/SearchModal.jsx', 'React component', 'Tìm kiếm sản phẩm bằng debounce và hiển thị kết quả trong modal.'],
  ['src/components/MiniChat.jsx', 'React component', 'Giao diện chat AI, gửi message và đọc stream token từ backend.'],
  ['src/components/AdminPage.jsx', 'React component', 'Dashboard quản trị users, products, athletes và chat logs.'],
  ['src/components/AthleteList.jsx', 'React component', 'Danh sách vận động viên, phân trang client-side.'],
  ['src/components/AthleteDetail.jsx', 'React component', 'Chi tiết vận động viên theo slug.'],
  ['src/components/LoginPage.jsx', 'React component', 'Đăng nhập Clerk bằng email/password và Google OAuth.'],
  ['src/components/RegisterPage.jsx', 'React component', 'Đăng ký bằng component SignUp của Clerk.'],
]));

parts.push(heading('2.2. JavaScript backend', 2));
parts.push(table(['File', 'Vai trò'], [
  ['server/index.js', 'Tạo Express app, cấu hình CORS, Clerk, MongoDB, route, chat stream và export app.'],
  ['server/routes/products.js', 'API sản phẩm public và CRUD admin.'],
  ['server/routes/athletes.js', 'API vận động viên public và CRUD admin.'],
  ['server/routes/auth.js', 'API lấy user hiện tại và quản lý user admin qua Clerk.'],
  ['server/routes/chat.js', 'API admin xem log, thống kê và trạng thái AI chat.'],
  ['server/models/Product.js', 'Schema Mongoose cho sản phẩm.'],
  ['server/models/Athlete.js', 'Schema Mongoose cho vận động viên.'],
  ['server/models/ChatLog.js', 'Schema Mongoose cho log chat AI.'],
  ['server/scripts/seed.js', 'Script nạp dữ liệu từ server/data vào MongoDB.'],
]));

parts.push(heading('2.3. Cấu hình và serverless', 2));
parts.push(table(['File', 'Vai trò'], [
  ['src/utils/api.js', 'Tạo API_BASE từ VITE_API_URL để frontend biết gọi backend nào.'],
  ['vite.config.js', 'Cấu hình Vite và proxy /api sang localhost:5000 khi chạy local.'],
  ['vercel.json', 'Cấu hình build frontend và rewrite route khi deploy.'],
  ['api/index.js, api/server.js, api/[...slug].js', 'Entry serverless export Express app cho Vercel.'],
  ['package.json', 'Script dev, start, build, lint, preview và danh sách dependencies.'],
]));

parts.push(heading('3. React hoạt động như thế nào'));
parts.push(heading('3.1. Entry React: src/main.jsx', 2));
parts.push(codeBlock(`
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
`));
parts.push(paragraph('Đoạn này gắn React vào thẻ div#root trong index.html. BrowserRouter giúp dùng URL như /catalog, /detail/:productId, /admin. ClerkProvider bật hệ thống xác thực Clerk. AuthProvider bọc thêm context riêng để toàn bộ app dễ lấy user, role admin và token.'));

parts.push(heading('3.2. Root component: src/App.jsx', 2));
parts.push(codeBlock(`
const [compareItems, setCompareItems] = useState([]);
const [isCompareOpen, setIsCompareOpen] = useState(false);
const [isSearchOpen, setIsSearchOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedProductType, setSelectedProductType] = useState('rackets');
`));
parts.push(paragraph('App.jsx giữ các state dùng chung toàn ứng dụng. compareItems nằm ở App để Header hiển thị số lượng, ProductCatalog thêm sản phẩm và CompareTool đọc cùng một nguồn dữ liệu. Đây là ví dụ của kỹ thuật nâng state lên component cha trong React.'));
parts.push(codeBlock(`
const addToCompare = (product) => {
  if (compareItems.length < 3 && !compareItems.find(p => p.id === product.id)) {
    setCompareItems([...compareItems, product]);
  }
};
`));
parts.push(paragraph('Function addToCompare chỉ cho thêm tối đa 3 sản phẩm và không thêm trùng id. Khi state thay đổi, React tự render lại Header badge và CompareTool.'));
parts.push(codeBlock(`
const viewProductDetail = (product, productType = 'rackets') => {
  setSelectedProduct(product);
  setSelectedProductType(productType);
  navigate(\`/detail/\${product.id}?type=\${productType}&name=\${encodeURIComponent(product.name)}\`);
};
`));
parts.push(paragraph('Function viewProductDetail lưu sản phẩm đang chọn rồi điều hướng sang trang chi tiết. Query string type và name giúp trang detail có thể tìm lại sản phẩm nếu người dùng refresh trang.'));

parts.push(heading('3.3. Routing trong App.jsx', 2));
parts.push(paragraph('App.jsx dùng Routes và Route để ánh xạ URL sang component. Ví dụ /catalog render ProductCatalog, /detail/:productId render ProductDetail, /athletes/:slug render AthleteDetail và /admin render AdminPage. Những route login, register và callback phục vụ Clerk authentication.'));

parts.push(heading('4. Các component React quan trọng'));
parts.push(heading('4.1. Header.jsx', 2));
parts.push(paragraph('Header nhận props từ App như compareCount, onOpenCompare, onProductsClick, onOpenSearch. Nó dùng useAuth để biết user đã đăng nhập chưa và có phải admin không.'));
parts.push(codeBlock(`
const { user, logout, isAdmin } = useAuth();
const { openUserProfile } = useClerk();
const [dropdownOpen, setDropdownOpen] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
`));
parts.push(paragraph('Nếu user là admin, Header hiển thị nút vào trang /admin. Nếu chưa đăng nhập, Header hiển thị nút đăng nhập. Mobile menu dùng state riêng để mở/đóng và khóa scroll body khi menu mở.'));

parts.push(heading('4.2. ProductCatalog.jsx', 2));
parts.push(paragraph('ProductCatalog là component quan trọng nhất ở phía người dùng. Nó quản lý danh sách sản phẩm, loại sản phẩm đang xem, loading, error và các bộ lọc.'));
parts.push(codeBlock(`
useEffect(() => {
  fetchProducts(productType);
}, [productType]);
`));
parts.push(paragraph('Mỗi khi productType thay đổi, ví dụ từ rackets sang shoes, useEffect gọi fetchProducts để lấy dữ liệu mới từ backend.'));
parts.push(codeBlock(`
const response = await fetch(\`\${API_BASE}/api/products/\${type}\`);
const data = await response.json();
setProducts(mappedData);
`));
parts.push(paragraph('Frontend gọi API theo type: /api/products/rackets, /api/products/shoes hoặc /api/products/shuttles. Dữ liệu trả về được đưa vào state products để render thành các card.'));
parts.push(paragraph('Bộ lọc hoạt động trên mảng products ở client: lọc theo series, giá, điểm cân bằng, trọng lượng/cỡ cầm, màu giày hoặc tốc độ cầu. Sau khi lọc, component map qua danh sách filtered để render product-card.'));

parts.push(heading('4.3. ProductDetail.jsx', 2));
parts.push(paragraph('ProductDetail nhận product từ App nếu người dùng đi từ catalogue. Nếu người dùng refresh trang, state trong App có thể mất, nên component có cơ chế fetch lại danh sách sản phẩm rồi tìm theo id hoặc name.'));
parts.push(codeBlock(`
const { productId } = useParams();
const typeFromUrl = new URLSearchParams(location.search).get('type');
const nameFromUrl = new URLSearchParams(location.search).get('name');
`));
parts.push(paragraph('useParams lấy productId từ URL /detail/:productId. Query string type và name giúp tăng khả năng tìm đúng sản phẩm.'));

parts.push(heading('4.4. CompareTool.jsx', 2));
parts.push(paragraph('CompareTool là modal so sánh sản phẩm. Nó nhận items từ App và khi modal mở thì fetch lại chi tiết sản phẩm để dữ liệu so sánh đầy đủ.'));
parts.push(codeBlock(`
const STATUS_TO_ENDPOINT = {
  racket: 'rackets',
  shoe: 'shoes',
  shoes: 'shoes',
  shuttle: 'shuttles'
};
`));
parts.push(paragraph('Mapping này cần thiết vì database lưu status là racket/shuttle, còn endpoint public dùng rackets/shuttles. CompareTool hiển thị thông số khác nhau theo loại sản phẩm: vợt có weight, balance, lbs, power/speed/control; giày có outsole, midsole, upper, size; cầu có type, headMaterial, speed, unit.'));

parts.push(heading('4.5. SearchModal.jsx', 2));
parts.push(paragraph('SearchModal dùng debounce 300ms để tránh gọi API quá nhiều khi người dùng gõ từng ký tự.'));
parts.push(codeBlock(`
const debounceTimer = setTimeout(searchProducts, 300);
return () => clearTimeout(debounceTimer);
`));
parts.push(paragraph('Hiện tại SearchModal fetch vợt và quả cầu, sau đó lọc theo name hoặc series ở frontend. Một điểm có thể cải thiện là thêm giày vào search và tạo endpoint search riêng ở backend.'));

parts.push(heading('4.6. MiniChat.jsx', 2));
parts.push(paragraph('MiniChat là giao diện chat với AI. Điểm đặc biệt là nó không chờ backend trả toàn bộ câu trả lời, mà đọc từng chunk/token từ response stream.'));
parts.push(codeBlock(`
const response = await fetch(\`\${CHAT_API_BASE}/api/chat/stream\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    history: buildHistory(messages),
  }),
});
`));
parts.push(codeBlock(`
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  sseBuffer += decoder.decode(value, { stream: true });
}
`));
parts.push(paragraph('Khi backend gửi token mới, MiniChat nối token đó vào message AI bằng setMessages. Vì vậy người dùng thấy câu trả lời xuất hiện dần giống các ứng dụng chat AI hiện đại.'));

parts.push(heading('4.7. AdminPage.jsx', 2));
parts.push(paragraph('AdminPage là dashboard quản trị. Nó kiểm tra quyền admin bằng AuthContext. Nếu user không phải admin, component điều hướng về trang chủ.'));
parts.push(codeBlock(`
useEffect(() => {
  if (loading) return;
  if (!isAdmin) { navigate('/'); return; }
  if (activeTab === 'users') fetchUsers();
  if (activeTab === 'products') fetchProducts();
  if (activeTab === 'athletes') fetchAthletes();
  if (activeTab === 'chat') fetchChatData(1, chatFilter);
}, [activeTab, isAdmin, loading]);
`));
parts.push(paragraph('Khi đổi tab, AdminPage fetch nhóm dữ liệu tương ứng. Các request admin đều lấy token Clerk bằng getToken và gửi trong Authorization header.'));
parts.push(codeBlock(`
const token = await getToken();
const res = await fetch(\`\${AUTH_API}/admin/users\`, {
  headers: { Authorization: \`Bearer \${token}\` }
});
`));
parts.push(paragraph('Backend vẫn kiểm tra lại token và role admin. Đây là điểm bảo mật quan trọng: frontend chỉ ẩn UI, còn backend mới là nơi quyết định có cho thao tác hay không.'));

parts.push(heading('5. Backend Express hoạt động như thế nào'));
parts.push(heading('5.1. Kết nối MongoDB', 2));
parts.push(codeBlock(`
let connectionPromise = null;

async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  return connectionPromise;
}
`));
parts.push(paragraph('ensureConnected giúp tránh mở nhiều kết nối MongoDB cùng lúc. Nếu đã kết nối thì return ngay. Nếu đang kết nối thì các request dùng chung connectionPromise. Cách này phù hợp với serverless vì function có thể được khởi tạo lại nhiều lần.'));

parts.push(heading('5.2. Middleware quan trọng', 2));
parts.push(bullet('cors: chỉ cho các origin hợp lệ gọi API, gồm localhost, domain Vercel và CLIENT_URL.'));
parts.push(bullet('express.json: đọc request body JSON.'));
parts.push(bullet('clerkMiddleware: đọc và xác thực thông tin Clerk trong request.'));
parts.push(bullet('middleware ensureConnected: đảm bảo MongoDB sẵn sàng trước khi route xử lý.'));

parts.push(heading('5.3. Product routes', 2));
parts.push(codeBlock(`
router.get('/:type', async (req, res) => {
  const map = { rackets: 'racket', shoes: 'shoes', shuttles: 'shuttle' };
  const status = map[req.params.type];
  if (!status) return res.status(404).json({ message: 'Loại sản phẩm không tồn tại.' });
  const products = await Product.find({ status, isActive: true }).lean();
  res.json(products);
});
`));
parts.push(paragraph('Route public này nhận type dạng plural từ frontend, map sang status trong database, chỉ lấy sản phẩm đang active rồi trả JSON.'));
parts.push(codeBlock(`
router.post('/', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
  const { type, ...rest } = req.body;
  const product = await Product.create({ ...rest, status: type, price: rest.price || 0 });
  res.status(201).json({ message: 'Thêm sản phẩm thành công.', product });
});
`));
parts.push(paragraph('Route admin này bắt buộc đăng nhập bằng requireAuth và kiểm tra role admin bằng Clerk backend API. Body từ frontend dùng type, backend chuyển thành status để lưu vào Product.'));

parts.push(heading('5.4. Athlete routes', 2));
parts.push(paragraph('Athlete routes có public list, public detail theo slug và CRUD admin. Public list chỉ trả vận động viên isActive true, còn admin/all trả cả bản đã ẩn để quản trị.'));
parts.push(codeBlock(`
router.get('/:slug', async (req, res) => {
  const athlete = await Athlete.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!athlete) return res.status(404).json({ message: 'Không tìm thấy vận động viên.' });
  res.json(athlete);
});
`));

parts.push(heading('5.5. Auth routes', 2));
parts.push(paragraph('Backend không tự lưu bảng users riêng. Nó lấy danh sách users và cập nhật role/status thông qua Clerk backend API. Role admin được lưu trong publicMetadata.role.'));
parts.push(codeBlock(`
async function isAdminUser(userId) {
  const user = await clerkClient.users.getUser(userId);
  return user.publicMetadata?.role === 'admin';
}
`));
parts.push(paragraph('Function này xuất hiện trong nhiều route admin. Nó đảm bảo chỉ người dùng có role admin trên Clerk mới được thao tác.'));

parts.push(heading('5.6. Chat stream và Victor Cortex', 2));
parts.push(paragraph('Endpoint /api/chat/stream là phần AI chat chính. Backend validate input bằng Zod, chặn một số nội dung nhạy cảm, tạo catalog sản phẩm từ MongoDB, đưa catalog vào system prompt, gọi Groq và stream token về frontend.'));
parts.push(codeBlock(`
const chatInputSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(1000),
  })).max(20).optional(),
  userId: z.string().max(200).optional(),
});
`));
parts.push(paragraph('Schema này giới hạn message tối đa 500 ký tự và history tối đa 20 tin nhắn. Điều này giúp backend tránh payload quá lớn hoặc sai định dạng.'));
parts.push(codeBlock(`
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.GROQ_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: GROQ_MODEL,
    stream: true,
    messages: await buildModelMessages(message, history),
    temperature: 0.7,
    max_tokens: 512,
  }),
});
`));
parts.push(paragraph('stream: true làm Groq trả về từng token. Backend đọc token từ Groq rồi ghi ra response dạng text/event-stream cho MiniChat.'));

parts.push(heading('6. Database models'));
parts.push(heading('6.1. Product', 2));
parts.push(bullet('Field chung: name, price, series, status, img, thumbnails, isActive.'));
parts.push(bullet('Vợt: sku/SKU, w/s, lbs, fm, sm, balance, stiff, performanceStats gồm power/speed/control.'));
parts.push(bullet('Giày: colors, outsole, midsole, upper, size.'));
parts.push(bullet('Quả cầu: type, headMaterial, speed, unit.'));
parts.push(paragraph('Product dùng một schema chung cho ba nhóm sản phẩm. Thuộc tính strict: false cho phép lưu thêm field từ dữ liệu gốc mà schema chưa khai báo rõ.'));

parts.push(heading('6.2. Athlete', 2));
parts.push(bullet('name và slug là thông tin quan trọng nhất. slug dùng cho URL /athletes/:slug.'));
parts.push(bullet('country, events, careerHigh dùng để hiển thị thông tin vận động viên.'));
parts.push(bullet('img và img2 dùng cho card và trang detail.'));
parts.push(bullet('isActive dùng cho xóa mềm.'));

parts.push(heading('6.3. ChatLog', 2));
parts.push(bullet('userMessage: câu hỏi của người dùng.'));
parts.push(bullet('aiResponse: câu trả lời AI.'));
parts.push(bullet('userId: Clerk user ID nếu có.'));
parts.push(bullet('blocked: message bị chặn bởi policy đơn giản.'));
parts.push(bullet('hasError: đánh dấu lỗi gọi AI.'));
parts.push(bullet('responseTimeMs: thời gian phản hồi.'));

parts.push(heading('7. Các luồng hoạt động chính'));
parts.push(heading('7.1. Luồng xem catalogue', 2));
parts.push(bullet('Người dùng vào /catalog.'));
parts.push(bullet('ProductCatalog đọc query type, mặc định là rackets.'));
parts.push(bullet('useEffect gọi fetchProducts(productType).'));
parts.push(bullet('Frontend gọi GET /api/products/:type.'));
parts.push(bullet('Backend query MongoDB bằng Product.find({ status, isActive: true }).'));
parts.push(bullet('Frontend nhận JSON, setProducts và render card.'));

parts.push(heading('7.2. Luồng so sánh sản phẩm', 2));
parts.push(bullet('Người dùng bấm COMPARE trên product card.'));
parts.push(bullet('ProductCatalog gọi onCompare(product).'));
parts.push(bullet('App.jsx chạy addToCompare, cập nhật compareItems.'));
parts.push(bullet('Header badge cập nhật số lượng.'));
parts.push(bullet('Khi mở CompareTool, component fetch lại chi tiết từng sản phẩm và hiển thị thông số theo loại.'));

parts.push(heading('7.3. Luồng quản trị', 2));
parts.push(bullet('Admin đăng nhập bằng Clerk.'));
parts.push(bullet('AuthContext đọc publicMetadata.role và tạo isAdmin.'));
parts.push(bullet('AdminPage kiểm tra isAdmin, nếu không đúng thì navigate về /.'));
parts.push(bullet('Khi gọi API admin, frontend lấy token bằng getToken.'));
parts.push(bullet('Backend dùng requireAuth và isAdminUser để kiểm tra lại trước khi thao tác.'));

parts.push(heading('7.4. Luồng AI chat', 2));
parts.push(bullet('Người dùng nhập message trong MiniChat.'));
parts.push(bullet('MiniChat gửi POST /api/chat/stream kèm message và history.'));
parts.push(bullet('Backend validate payload, build catalog sản phẩm từ MongoDB và gọi Groq.'));
parts.push(bullet('Groq trả token dạng stream.'));
parts.push(bullet('Backend chuyển token thành SSE event.'));
parts.push(bullet('MiniChat đọc event và nối token vào bubble trả lời.'));
parts.push(bullet('Backend lưu ChatLog để admin theo dõi.'));

parts.push(heading('8. Cách chạy và cấu hình'));
parts.push(heading('8.1. Lệnh chạy local', 2));
parts.push(codeBlock(`
npm install
npm run start
`));
parts.push(paragraph('npm run start chạy đồng thời Vite frontend và backend trong thư mục server. Có thể chạy riêng frontend bằng npm run dev và backend bằng npm run server.'));
parts.push(heading('8.2. Seed dữ liệu', 2));
parts.push(codeBlock(`
node server/scripts/seed.js
`));
parts.push(paragraph('Script này đọc dữ liệu từ server/data/racket.js, shoes.js, shuttle.js và athletes.js, sau đó ghi vào MongoDB.'));
parts.push(heading('8.3. Biến môi trường cần có', 2));
parts.push(bullet('Frontend: VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL.'));
parts.push(bullet('Backend: MONGODB_URI, CLERK_SECRET_KEY, GROQ_API_KEY, GROQ_MODEL, CLIENT_URL, PORT.'));

parts.push(heading('9. Điểm mạnh, hạn chế và hướng cải thiện'));
parts.push(heading('9.1. Điểm mạnh', 2));
parts.push(bullet('Luồng người dùng khá đầy đủ: trang chủ, catalogue, detail, compare, search, athletes, auth và chat AI.'));
parts.push(bullet('Backend kiểm tra quyền admin thật sự bằng Clerk, không chỉ ẩn UI trên frontend.'));
parts.push(bullet('AI chat được grounding bằng catalog lấy từ database, hạn chế bịa sản phẩm.'));
parts.push(bullet('Có seed data cho sản phẩm và vận động viên.'));
parts.push(heading('9.2. Hạn chế', 2));
parts.push(bullet('README hiện vẫn là README mẫu của Vite.'));
parts.push(bullet('Một số chuỗi tiếng Việt trong source đang bị lỗi encoding khi đọc file.'));
parts.push(bullet('.env.example chưa liệt kê đầy đủ biến môi trường bắt buộc.'));
parts.push(bullet('Chưa có test tự động cho API và UI.'));
parts.push(bullet('SearchModal chưa tìm giày.'));
parts.push(bullet('ProductDetail đang fetch cả danh sách rồi tìm sản phẩm; nên có endpoint detail riêng theo id hoặc slug.'));
parts.push(bullet('Có nhiều entry serverless trùng vai trò, nên chuẩn hóa lại chiến lược deploy.'));

parts.push(heading('10. Gợi ý trình bày khi báo cáo'));
parts.push(paragraph('Có thể trình bày theo hướng sau:'));
parts.push(bullet('Mở đầu: Victor là web app full-stack cho thương hiệu cầu lông VICTOR, giúp người dùng tìm hiểu, so sánh và được tư vấn sản phẩm.'));
parts.push(bullet('Giải thích React: mọi màn hình trong src/components là component React. React dùng useState để lưu trạng thái, useEffect để gọi API, props để truyền hàm từ App xuống component con.'));
parts.push(bullet('Giải thích backend: Express định nghĩa API, Mongoose truy vấn MongoDB, Clerk kiểm tra đăng nhập và role admin.'));
parts.push(bullet('Giải thích luồng sản phẩm: ProductCatalog gọi API, backend query Product, frontend render card.'));
parts.push(bullet('Giải thích bảo mật: frontend có thể ẩn nút admin, nhưng backend vẫn phải requireAuth và kiểm tra role.'));
parts.push(bullet('Giải thích AI: MiniChat gửi message, backend thêm catalog vào prompt, Groq stream token, frontend hiển thị dần.'));
parts.push(bullet('Kết luận: dự án đã có nền tảng đầy đủ, cần tiếp tục chuẩn hóa tài liệu, test, API detail/search và cấu hình deploy.'));

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${parts.join('\n')}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${NS}">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/></w:rPr>
    <w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="003DA5"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="360"/></w:pPr>
    <w:rPr><w:i/><w:sz w:val="24"/><w:color w:val="555555"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="360" w:after="180"/><w:outlineLvl w:val="0"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="003DA5"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="E8412A"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="200" w:after="100"/><w:outlineLvl w:val="2"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="23"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Code">
    <w:name w:val="Code"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/><w:color w:val="1F2937"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="TableHeader">
    <w:name w:val="Table Header"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="FFFFFF"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="TableText">
    <w:name w:val="Table Text"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:sz w:val="19"/></w:rPr>
  </w:style>
  <w:style w:type="table" w:styleId="TableGrid">
    <w:name w:val="Table Grid"/>
    <w:tblPr>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:color="BFBFBF"/>
        <w:left w:val="single" w:sz="4" w:color="BFBFBF"/>
        <w:bottom w:val="single" w:sz="4" w:color="BFBFBF"/>
        <w:right w:val="single" w:sz="4" w:color="BFBFBF"/>
        <w:insideH w:val="single" w:sz="4" w:color="BFBFBF"/>
        <w:insideV w:val="single" w:sz="4" w:color="BFBFBF"/>
      </w:tblBorders>
    </w:tblPr>
  </w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="${NS}">
  <w:abstractNum w:abstractNumId="0">
    <w:multiLevelType w:val="hybridMultilevel"/>
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
      <w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;

const files = [
  ['[Content_Types].xml', Buffer.from(contentTypesXml, 'utf8')],
  ['_rels/.rels', Buffer.from(relsXml, 'utf8')],
  ['word/document.xml', Buffer.from(documentXml, 'utf8')],
  ['word/styles.xml', Buffer.from(stylesXml, 'utf8')],
  ['word/numbering.xml', Buffer.from(numberingXml, 'utf8')],
  ['word/_rels/document.xml.rels', Buffer.from(documentRelsXml, 'utf8')],
];

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function createZip(entries) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const [name, data] of entries) {
    const nameBuffer = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30 + nameBuffer.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);
    nameBuffer.copy(local, 30);
    chunks.push(local, data);

    const centralHeader = Buffer.alloc(46 + nameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuffer.copy(centralHeader, 46);
    central.push(centralHeader);
    offset += local.length + data.length;
  }

  const centralStart = offset;
  const centralBuffer = Buffer.concat(central);
  const centralSize = centralBuffer.length;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralStart, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, centralBuffer, end]);
}

fs.writeFileSync(outputPath, createZip(files));
console.log(`Created ${outputPath}`);
